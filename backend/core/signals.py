from django.db.models.signals import post_save, post_delete

from core.models import (
    CFUser,
    Student,
    Contract,
    Service,
    Application,
    ApplicationLog,
)

from target.models import (
    ApplicationRound,
    ProgramIteration,
    Program,
    School,
    SchoolRanking,
    SchoolRankingEntry,
)

from academics.models import (
    Enrollment,
    Grade,
    TOEFLScore,
    IELTSScore,
    DuolingoScore,
    SATScore,
    ACTScore,
    APScore,
    IBGrade,
    ALevelGrade,
    GREScore,
    GMATScore,
    LSATScore,
)

from core.views import (
    StudentListView,
    StudentPerUserListView,
    ApplicationWithLogsListView,
    ApplicationTargetListView,
    SchoolWithRankingsListView,
    ApplicationContractListView,
)

from target.views import SchoolRankingEntryListView
from academics.views import EnrollmentListView

from core.cache_utils import invalidate_view_cache

_academic_models = [
    Enrollment,
    Grade,
    TOEFLScore,
    IELTSScore,
    DuolingoScore,
    SATScore,
    ACTScore,
    APScore,
    IBGrade,
    ALevelGrade,
    GREScore,
    GMATScore,
    LSATScore,
]


def invalidate_student_cache(sender, **_):
    print("invalidating cache for StudentListView")
    invalidate_view_cache(StudentListView.__name__)
    print("invalidating cache for ApplicationContractListView")
    invalidate_view_cache(ApplicationContractListView.__name__)


for sender in [Student, Contract, Service, CFUser, School] + _academic_models:
    post_save.connect(invalidate_student_cache, sender=sender)
    post_delete.connect(invalidate_student_cache, sender=sender)


def invalidate_student_per_user_cache(sender, **_):
    print("invalidating cache for StudentPerUserListView")
    invalidate_view_cache(StudentPerUserListView.__name__)


for sender in [Student, Contract, Service, CFUser]:
    post_save.connect(invalidate_student_per_user_cache, sender=sender)
    post_delete.connect(invalidate_student_per_user_cache, sender=sender)


def invalidate_application_with_logs_cache(sender, **_):
    print("invalidating cache for ApplicationWithLogsListView")
    invalidate_view_cache(ApplicationWithLogsListView.__name__)


for sender in [Application, ApplicationLog]:
    post_save.connect(invalidate_application_with_logs_cache, sender=sender)
    post_delete.connect(invalidate_application_with_logs_cache, sender=sender)


def invalidate_application_target_cache(sender, **_):
    print("invalidating cache for ApplicationTargetListView")
    invalidate_view_cache(ApplicationTargetListView.__name__)


for sender in [ApplicationRound, ProgramIteration, Program, School]:
    post_save.connect(invalidate_application_target_cache, sender=sender)
    post_delete.connect(invalidate_application_target_cache, sender=sender)


def invalidate_school_with_rankings_cache(sender, **_):
    print("invalidating cache for SchoolWithRankingsListView")
    invalidate_view_cache(SchoolWithRankingsListView.__name__)


for sender in [School, SchoolRanking, SchoolRankingEntry]:
    post_save.connect(invalidate_school_with_rankings_cache, sender=sender)
    post_delete.connect(invalidate_school_with_rankings_cache, sender=sender)


def invalidate_school_ranking_cache(sender, **_):
    print("invalidating cache for SchoolRankingEntryListView")
    invalidate_view_cache(SchoolRankingEntryListView.__name__)


for sender in [School, SchoolRanking, SchoolRankingEntry]:
    post_save.connect(invalidate_school_ranking_cache, sender=sender)
    post_delete.connect(invalidate_school_ranking_cache, sender=sender)


def invalidate_enrollment_cache(sender, **_):
    print("invalidating cache for EnrollmentListView")
    invalidate_view_cache(EnrollmentListView.__name__)


for sender in [Enrollment, Student, Contract, School]:
    post_save.connect(invalidate_enrollment_cache, sender=sender)
    post_delete.connect(invalidate_enrollment_cache, sender=sender)
