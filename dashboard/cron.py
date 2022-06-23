from .models import Experiment, Pod
from django.db.models import F
from datetime import datetime, timedelta
from django.utils import timezone


def check_experiments_end_date_daily():
    active_exps = Experiment.objects.filter(end_date__isnull=True).select_related('recipe').annotate(recipe_days=F('recipe__days'))
    curr_date = datetime.now()
    tz = timezone.get_current_timezone()
    curr_date = curr_date.replace(tzinfo=tz)
    active_exps.update(day=F('day')+1) 
    for exp in active_exps:
        exp_curr_date = exp.start_date.date() + timedelta(days=exp.recipe_days)
        if exp_curr_date >= curr_date.date():
            inactive_exp = Experiment.objects.get(id=exp.id)
            inactive_exp.end_date = curr_date
            inactive_exp.save()
            pods = Pod.objects.filter(experiment = exp.id, end_date__isnull=True)
            pods.update(end_date=curr_date)
