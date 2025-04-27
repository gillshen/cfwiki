import traceback

from django.core.cache import cache
from django.http import QueryDict
from rest_framework.response import Response


class CacheResponseMixin:
    cache_timeout = 60 * 15  # Default: 15 minutes
    cache_relevant_params: str | set[str] = "__all__"

    def get_cache_key(self):
        """Generate unique cache key based on view class name and query parameters"""
        base_key = self.__class__.__name__
        params = self.get_cache_params()
        return f"{base_key}({params})"

    def get_cache_params(self):
        if self.cache_relevant_params == "__all__":
            return self.request.query_params.urlencode()

        # Look only at the params explicitly declared as relevant
        relevant_params = QueryDict(mutable=True)
        for key, value_list in self.request.query_params.lists():
            if key in self.cache_relevant_params:
                relevant_params[key] = value_list
        return relevant_params.urlencode()

    def list(self, request, *args, **kwargs):
        cache_key = self.get_cache_key()

        # Try to get cached response
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            print(f"cache hit: {cache_key}")
            try:
                return Response(cached_data)
            except Exception:
                traceback.print_exc()

        # Cache miss
        print(f"cache miss: {cache_key}")
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, self.cache_timeout)
        register_cache_key(self.__class__.__name__, cache_key)
        return response


def invalidate_view_cache(view_name: str):
    """Clear all cache entries for a specific view class"""
    try:
        registry_key = get_registry_key(view_name)
        registry = cache.get(registry_key)
        if registry:
            # Delete all keys in the registry
            for key in registry:
                cache.delete(key)
            # Reset the registry
            cache.delete(registry_key)
    except Exception:
        traceback.print_exc()


# Cache key for the registry of all view cache keys
def get_registry_key(view_name):
    return f"{view_name}_cache_registry"


def register_cache_key(view_name, cache_key):
    """Add a cache key to the registry"""
    registry_key = get_registry_key(view_name)

    # Get existing registry or create a new one
    registry = cache.get(registry_key) or set()
    registry.add(cache_key)

    # Store updated registry
    cache.set(registry_key, registry)
