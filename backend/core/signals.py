from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

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


@receiver([post_save, post_delete], sender=Student)
@receiver([post_save, post_delete], sender=Contract)
@receiver([post_save, post_delete], sender=Service)
@receiver([post_save, post_delete], sender=CFUser)
@receiver([post_save, post_delete], sender=Enrollment)
@receiver([post_save, post_delete], sender=Grade)
@receiver([post_save, post_delete], sender=TOEFLScore)
@receiver([post_save, post_delete], sender=IELTSScore)
@receiver([post_save, post_delete], sender=DuolingoScore)
@receiver([post_save, post_delete], sender=SATScore)
@receiver([post_save, post_delete], sender=ACTScore)
@receiver([post_save, post_delete], sender=APScore)
@receiver([post_save, post_delete], sender=IBGrade)
@receiver([post_save, post_delete], sender=ALevelGrade)
@receiver([post_save, post_delete], sender=GREScore)
@receiver([post_save, post_delete], sender=GMATScore)
@receiver([post_save, post_delete], sender=LSATScore)
def handle_student_changes(sender, **_):
    invalidate_view_cache(StudentListView.__name__)


@receiver([post_save, post_delete], sender=Student)
@receiver([post_save, post_delete], sender=Contract)
@receiver([post_save, post_delete], sender=Service)
@receiver([post_save, post_delete], sender=CFUser)
def handle_student_per_user_changes(sender, **_):
    invalidate_view_cache(StudentPerUserListView.__name__)


@receiver([post_save, post_delete], sender=Application)
@receiver([post_save, post_delete], sender=ApplicationLog)
def handle_application_core_changes(sender, **_):
    print("invalidating cache for ApplicationWithLogsListView")
    invalidate_view_cache(ApplicationWithLogsListView.__name__)


@receiver([post_save, post_delete], sender=ApplicationRound)
@receiver([post_save, post_delete], sender=ProgramIteration)
@receiver([post_save, post_delete], sender=Program)
@receiver([post_save, post_delete], sender=School)
def handle_application_target_changes(sender, **_):
    print("invalidating cache for ApplicationTargetListView")
    invalidate_view_cache(ApplicationTargetListView.__name__)


@receiver([post_save, post_delete], sender=School)
@receiver([post_save, post_delete], sender=SchoolRanking)
@receiver([post_save, post_delete], sender=SchoolRankingEntry)
def handle_school_with_rankings_changes(sender, **_):
    invalidate_view_cache(SchoolWithRankingsListView.__name__)


@receiver([post_save, post_delete], sender=Student)
@receiver([post_save, post_delete], sender=Contract)
@receiver([post_save, post_delete], sender=Service)
@receiver([post_save, post_delete], sender=CFUser)
@receiver([post_save, post_delete], sender=Enrollment)
@receiver([post_save, post_delete], sender=School)
@receiver([post_save, post_delete], sender=Grade)
@receiver([post_save, post_delete], sender=TOEFLScore)
@receiver([post_save, post_delete], sender=IELTSScore)
@receiver([post_save, post_delete], sender=DuolingoScore)
@receiver([post_save, post_delete], sender=SATScore)
@receiver([post_save, post_delete], sender=ACTScore)
@receiver([post_save, post_delete], sender=APScore)
@receiver([post_save, post_delete], sender=IBGrade)
@receiver([post_save, post_delete], sender=ALevelGrade)
@receiver([post_save, post_delete], sender=GREScore)
@receiver([post_save, post_delete], sender=GMATScore)
@receiver([post_save, post_delete], sender=LSATScore)
def handle_application_contract_changes(sender, **_):
    invalidate_view_cache(ApplicationContractListView.__name__)


@receiver([post_save, post_delete], sender=SchoolRankingEntry)
@receiver([post_save, post_delete], sender=SchoolRanking)
@receiver([post_save, post_delete], sender=School)
def handle_school_ranking_changes(sender, **_):
    invalidate_view_cache(SchoolRankingEntryListView.__name__)


@receiver([post_save, post_delete], sender=Enrollment)
@receiver([post_save, post_delete], sender=Student)
@receiver([post_save, post_delete], sender=Contract)
@receiver([post_save, post_delete], sender=School)
def handle_enrollment_changes(sender, **_):
    invalidate_view_cache(EnrollmentListView.__name__)
