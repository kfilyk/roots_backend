from .models import Experiment, Pod, Recipe, Device
from django.db.models import F
from datetime import datetime, timedelta
from django.utils import timezone


def check_experiments_end_date_daily():
    curr_date = datetime.now()
    tz = timezone.get_current_timezone()
    curr_date = curr_date.replace(tzinfo=tz)
    phases = Recipe._meta.fields[4:14]
    active_exps = Experiment.objects.filter(end_date__isnull=True)
    active_exp_ids = [exp.id for exp in active_exps if exp.start_date.date() <= curr_date.date()]
    active_exps = Experiment.objects.filter(pk__in=active_exp_ids).select_related('recipe').annotate(recipe_days=F('recipe__days'))
    active_exps.update(day=F('day')+1) 
    
    for curr_exp in active_exps:
        # if (curr_exp.start_date.date() + timedelta(curr_exp.recipe_days)) <= (curr_exp.start_date.date() + timedelta(curr_exp.days)):
        if (curr_exp.start_date.date() + timedelta(curr_exp.recipe_days)) <= curr_date.date():
            curr_exp.end_date = curr_date
            curr_exp.save()
            pods = Pod.objects.filter(experiment = curr_exp.id, end_date__isnull=True)
            pods.update(end_date=curr_date)
        else: 
            curr_exp_day = curr_exp.day
            for p in phases:
                curr_phase = getattr(curr_exp.recipe, p.name, None)
                if curr_phase is not None:
                    if (curr_exp_day - curr_phase.days) < 0:
                        curr_exp.current_phase = getattr(curr_exp.recipe, p.name, None)
                        curr_exp.phase_day = curr_exp_day
                        curr_exp.save()
                        break
                    else:
                        curr_exp_day = curr_exp_day - curr_phase.days

def check_device_activity():
    print("RUNNING")
    devices = Device.objects.all()
    devices[0].update(capacity = 10)
