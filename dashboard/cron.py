from .models import Device, Experiment, Pod

def check_experiments_end_date_daily():
    active_exps = Experiment.objects.filter(end_date__isnull=True)
    print("HELLO: ", active_exps)