# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.conf import settings

'''
set FOREIGN_KEY_CHECKS = 0;
-- drop table plant_science.device cascade;
-- drop table plant_science.experiment cascade;
-- drop table plant_science.plant cascade;
-- drop table plant_science.experimentReading cascade;
-- drop table plant_science.pod cascade;
-- drop table plant_science.podPack cascade;
-- drop table plant_science.recipe cascade;
'''

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react
# https://djangoadventures.com/how-to-integrate-django-with-existing-database/

class Device(models.Model):
    id = models.AutoField(db_column='d_id', primary_key=True)
    model = models.CharField(db_column='d_model', max_length=45, blank=True, null=True) 
    name = models.CharField(db_column='d_name', max_length=45, blank=True, null=True)  
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='d_user_id', on_delete=models.CASCADE, blank=True, null=True)  
    token = models.CharField(max_length=45, blank=True, null=True)
    registration_date = models.DateTimeField(db_column='d_registration_date', auto_now_add=True)  
    last_update = models.DateTimeField(db_column='d_last_update', blank=True, null=True)  
    is_online = models.BooleanField(db_column='d_is_online', default=False)  
    mac_address = models.CharField(db_column='d_mac_address', max_length=45, blank=True, null=True)  
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, related_name='+', db_column='d_experiment_id', blank=True, null=True)  
    fill_res_flag = models.BooleanField(db_column='d_fill_res_flag', default=False) 

    class Meta:
        managed = True
        db_table = 'device'

class Experiment(models.Model):
    id = models.AutoField(db_column='e_id', primary_key=True)  
    description = models.CharField(db_column='e_description', max_length=255, blank=True, null=True)
    current_stage = models.ForeignKey("Stage", models.DO_NOTHING, related_name='+', db_column='e_current_stage',blank=True, null=True) # 
    stages = models.CharField(db_column='e_stages', max_length=255, blank=True, null=True) # this is a list in the format = [stage_id_1, stage_id_2, stage_id_3 ... stage_id_n]
    day = models.IntegerField(db_column='e_day', default = 0) 
    stage_day = models.IntegerField(db_column='e_stage_day', default = 0) 
    device = models.ForeignKey("Device", models.DO_NOTHING, related_name='+', db_column='e_device_id', blank=True, null=True)  
    score = models.DecimalField(db_column='e_score', max_digits=2, decimal_places=2, blank=True, null=True) # score should be the averaged score of all pod Experiment Readings
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='e_user_id', on_delete=models.CASCADE, blank=True, null=True)  
    start_date = models.DateTimeField(db_column='e_start_date', blank=True, null=True)  
    end_date = models.DateTimeField(db_column='e_end_date', blank=True, null=True)  
    pod1 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod1', blank=True, null=True)
    pod2 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod2', blank=True, null=True)
    pod3 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod3', blank=True, null=True)
    pod4 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod4', blank=True, null=True)
    pod5 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod5', blank=True, null=True)
    pod6 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod6', blank=True, null=True)
    pod7 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod7', blank=True, null=True)
    pod8 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod8', blank=True, null=True)
    pod9 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod9', blank=True, null=True)
    pod10 = models.ForeignKey("Pod", models.DO_NOTHING, related_name='+', db_column='e_pod10', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'experiment'

# many readings per experiment - is written by a user to the db in reference to an experiment
class ExperimentReading(models.Model):
    id = models.AutoField(db_column='er_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='er_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    water_level = models.IntegerField(db_column='er_water_level', blank=True, null=True) 
    reading_date = models.DateTimeField(db_column='er_reading_date', auto_now_add=True)
    electrical_conductance = models.IntegerField(db_column='er_electrical_conductance', blank=True, null=True) 
    reservoir_tds = models.IntegerField(db_column='er_reservoir_tds', blank=True, null=True) 
    reservoir_ph = models.IntegerField(db_column='er_reservoir_ph', blank=True, null=True)  
    recipe_stage = models.IntegerField(db_column='er_recipe_stage', blank=True, null=True) # 
    temperature = models.DecimalField(db_column='er_temperature', max_digits=2, decimal_places=2, blank=True, null=True) 
    humidity = models.DecimalField(db_column='er_humidity', max_digits=2, decimal_places=2, blank=True, null=True)
    photo_link = models.CharField(db_column='er_photo_link', max_length=100, blank=True, null=True)
    '''
    pod1_score = models.DecimalField(db_column='er_pod1_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod2_score = models.DecimalField(db_column='er_pod2_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod3_score = models.DecimalField(db_column='er_pod3_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod4_score = models.DecimalField(db_column='er_pod4_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod5_score = models.DecimalField(db_column='er_pod5_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod6_score = models.DecimalField(db_column='er_pod6_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod7_score = models.DecimalField(db_column='er_pod7_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod8_score = models.DecimalField(db_column='er_pod8_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod9_score = models.DecimalField(db_column='er_pod9_score', max_digits=2, decimal_places=2, blank=True, null=True)
    pod10_score = models.DecimalField(db_column='er_pod10_score', max_digits=2, decimal_places=2, blank=True, null=True)
    '''

    class Meta:
        managed = True
        db_table = 'experiment_reading'

# many readings per experiment - is written by a user to the db in reference to an experiment
class PodReading(models.Model):
    id = models.AutoField(db_column='pr_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='pr_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    experiment_reading = models.ForeignKey("ExperimentReading", models.DO_NOTHING, db_column='pr_experiment_reading_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    plant_height = models.DecimalField(db_column='pr_plant_height', max_digits=5, decimal_places=2, blank=True, null=True)
    node_count = models.IntegerField(db_column='pr_node_count', blank=True, null=True) 
    internode_distance = models.DecimalField(db_column='pr_pod_reading', max_digits=5, decimal_places=2, blank=True, null=True) 
    leaf_count = models.IntegerField(db_column='pr_leaf_count', blank=True, null=True) 
    seeds_germinated = models.IntegerField(db_column='pr_seeds_germinated', blank=True, null=True) 
    pest_coverage = models.IntegerField(db_column='pr_pest_coverage', default=False) # integer between 0 and 100
    algae_coverage =  models.IntegerField(db_column='pr_algae_coverage', default=False)  
    blight_coverage = models.IntegerField(db_column='pr_blight_coverage', default=False)  
    harvest_weight = 
    harvest_number = 
    harvest_quality = 
    flower_weight = 
    flower_number = 
    flower_quality = 
    
    comment = models.CharField(db_column='pr_comment', max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pod_reading'


class Plant(models.Model): # types: basil, 
    id = models.AutoField(db_column='pl_id', primary_key=True)  
    name = models.CharField(db_column='pl_name', max_length=45)  
    supplier = models.CharField(db_column = 'pl_supplier', max_length=45, blank=True, null=True)
    score = models.DecimalField(db_column='pl_score', max_digits=2, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plant'

class Pod(models.Model):
    id = models.AutoField(db_column='po_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='po_experiment_id')  # pods created automatically when an experiment is created
    plant = models.ForeignKey(Plant, models.DO_NOTHING, db_column='po_plant_id', blank=True, null=True)  # type of plant for this pod 
    seeds_planted = models.IntegerField(db_column = 'po_seeds_planted', blank=True, null=True)
    position = models.IntegerField(db_column = 'po_position', blank=True, null=True) # position of pod in byte
    state = models.IntegerField(db_column = 'po_state', default = 0) #planted = 0, sprouted = 1, true leaves = 3, harvested = 4, died early = 5
    score = models.DecimalField(db_column='po_score', max_digits=2, decimal_places=2, blank=True, null=True) # Averaged score of Experiment Readings for a specific pod
    start_date = models.DateTimeField(db_column='po_start_date', blank=True, null=True) # start date is 
    end_date = models.DateTimeField(db_column='po_end_date', blank=True, null=True)  
    
    class Meta:
        managed = True
        db_table = 'pod'

class Stage(models.Model): # generic periodic stage setting to be used by a recipe 
    id = models.CharField(db_column='s_id', primary_key=True, max_length=45) # name of stage - not necessarily a nubmer
    author = models.CharField(db_column='s_author', max_length=45) 
    days = models.IntegerField(db_column = 's_days')
    watering_cycles = models.IntegerField(db_column = 's_watering_cycles') # number of times per day watered
    nutrient_cycles =  models.IntegerField(db_column = 's_nutrient_cycles') # number of times per day applied nutrients 
    nutrient_type = models.CharField(db_column='s_nutrient_type', max_length=45, blank=True, null=True)   
    # probably will need to specify nutrient application days
    blue_intensity = models.IntegerField(db_column = 's_blue_intensity')
    red_intensity = models.IntegerField(db_column = 's_red_intensity')
    white1_intensity = models.IntegerField(db_column = 's_white1_intensity')
    white2_intensity = models.IntegerField(db_column = 's_white2_intensity')
    lights_on_hours = models.IntegerField(db_column = 's_lights_on_hours') # denotes hours left on per day
    score = models.DecimalField(db_column='s_score', max_digits=2, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'stage'