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
    fill_res_flag = models.BooleanField(db_column='d_fill_res_flag', default=False) 
    capacity = models.IntegerField(db_column='d_capacity', default = 5) 

    class Meta:
        managed = True
        db_table = 'device'

class Experiment(models.Model):
    id = models.AutoField(db_column='e_id', primary_key=True)  
    name = models.CharField(db_column='e_name', max_length=255, blank=True, null=True)
    current_phase = models.ForeignKey("Phase", models.DO_NOTHING, related_name='+', db_column='e_current_phase',blank=True, null=True) # germination, seedling, vegetative growth, flowering, fruiting, other1, terminated, complete
    day = models.IntegerField(db_column='e_day', default = 0) 
    phase_day = models.IntegerField(db_column='e_phase_day', default = 0) 
    device = models.ForeignKey("Device", models.DO_NOTHING, related_name='+', db_column='e_device_id')  
    # this score not filled until end of experiment
    score = models.DecimalField(db_column='e_score', max_digits=2, decimal_places=2, blank=True, null=True) # score should be the averaged score of all pod Experiment Readings
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='e_user_id', on_delete=models.CASCADE, blank=True, null=True)  
    start_date = models.DateTimeField(db_column='e_start_date', blank=True, null=True)  
    end_date = models.DateTimeField(db_column='e_end_date', blank=True, null=True)  
    recipe_json = models.CharField(db_column='e_recipe_json', max_length=4096, blank=True, null=True)# store the recipe json used to control the experiment

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
    experiment_phase = models.IntegerField(db_column='er_experiment_phase', blank=True, null=True) 
    temperature = models.DecimalField(db_column='er_temperature', max_digits=2, decimal_places=2, blank=True, null=True) 
    humidity = models.DecimalField(db_column='er_humidity', max_digits=2, decimal_places=2, blank=True, null=True)
    photo_link = models.CharField(db_column='er_photo_link', max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'experiment_reading'

# manual intervention object: prune, water, nutrient, dome, trellis, raising light,  <- pod phase (germination, sprouted, harvest,  etc) needs to be recorded
# lighting in intensity (0 -> 1) range (for now); later PPFD

# pest_coverage, algae_coverage,blight_coverage default set to results of previous reading. Quantize to 4 , no numeric inputs, just happy faces

# many readings per experiment - is written by a user to the db in reference to an experiment
class PodReading(models.Model):
    id = models.AutoField(db_column='pr_id', primary_key=True)  
    domes = models.BooleanField(default= 0, null=True)
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='pr_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    experiment_reading = models.ForeignKey("ExperimentReading", models.DO_NOTHING, db_column='pr_experiment_reading_id', blank=True, null=True)  # delete experiment readings if experiment is deleted

    node_count = models.IntegerField(db_column='pr_node_count', blank=True, null=True) 
    internode_distance = models.DecimalField(db_column='pr_pod_reading', max_digits=5, decimal_places=2, blank=True, null=True) 
    leaf_count = models.IntegerField(db_column='pr_leaf_count', blank=True, null=True) 
    seeds_germinated = models.IntegerField(db_column='pr_seeds_germinated', blank=True, null=True) 
    pod_phase = models.CharField(db_column='pr_pod_phase', max_length=45, blank=True, null=True)
    media_to_bgp = models.DecimalField(db_column='pr_media_to_bgp', max_digits=5, decimal_places=2, blank=True, null=True)
    min_height = models.DecimalField(db_column='pr_min_height', max_digits=5, decimal_places=2, blank=True, null=True)
    max_height = models.DecimalField(db_column='pr_max_height', max_digits=5, decimal_places=2, blank=True, null=True)
    leaf_area_avg = models.DecimalField(db_column='pr_leaf_area_avg', max_digits=5, decimal_places=2, blank=True, null=True)

    pest_coverage = models.IntegerField(db_column='pr_pest_coverage', default=False) 
    algae_coverage =  models.IntegerField(db_column='pr_algae_coverage', default=False)  
    blight_coverage = models.IntegerField(db_column='pr_blight_coverage', default=False)  

    bud_count = models.IntegerField(db_column='pr_bud_count', blank=True, null=True)
    flower_count = models.IntegerField(db_column='pr_flower_count', blank=True, null=True)
    flower_quality = models.IntegerField(db_column='pr_flower_quality', default=False)  
    fruit_unripe_count = models.IntegerField(db_column='pr_fruit_unripe_count', blank=True, null=True)
    fruit_ripe_count = models.IntegerField(db_column='pr_fruit_ripe_count', blank=True, null=True)
    harvest_count = models.IntegerField(db_column='pr_harvest_number', default=False)  
    harvest_weight = models.DecimalField(db_column='pr_harvest_weight', max_digits=5, decimal_places=2, blank=True, null=True)
    harvest_quality = models.IntegerField(db_column='pr_harvest_quality', default=False)  

    comment = models.CharField(db_column='pr_comment', max_length=255, blank=True, null=True)
    score = models.DecimalField(db_column='pr_score', max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pod_reading'


class Pod(models.Model):
    id = models.AutoField(db_column='po_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", models.CASCADE, db_column='po_experiment_id')  # pods created automatically when an experiment is created
    plant = models.ForeignKey("Plant", models.DO_NOTHING, db_column='po_plant_id', null=True)  # type of plant for this pod 
    seeds_planted = models.IntegerField(db_column = 'po_seeds_planted', blank=True, null=True)
    position = models.IntegerField(db_column = 'po_position', blank=True, null=True) # position of pod in byte
    phase = models.IntegerField(db_column = 'po_phase', default = 0) #planted = 0, sprouted = 1, true leaves = 3, harvested = 4, died early = 5
    score = models.DecimalField(db_column='po_score', max_digits=2, decimal_places=2, blank=True, null=True) # Averaged score of Experiment Readings for a specific pod
    start_date = models.DateTimeField(db_column='po_start_date', blank=True, null=True) # start date is 
    end_date = models.DateTimeField(db_column='po_end_date', blank=True, null=True)  
    
    class Meta:
        managed = True
        db_table = 'pod'

# phases can be used by many recipes/experiments
class Phase(models.Model): # generic periodic phase setting to be used by a recipe 
    id = models.AutoField(db_column='ph_id', primary_key=True)  
    name = models.CharField(db_column='ph_name', max_length=45) # name of phase - not necessarily a nubmer
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='ph_user', on_delete=models.CASCADE, blank=True, null=True) # denotes creator
    days = models.IntegerField(db_column = 'ph_days')
    type = models.CharField(db_column='ph_type', max_length=45) # germination / seedling / veggie growth/ harvest /... / other
    waterings_per_day = models.IntegerField(db_column = 'ph_waterings_per_day') # number of times per day watered
    watering_duration = models.IntegerField(db_column = 'ph_watering_duration')
    blue_intensity = models.IntegerField(db_column = 'ph_blue_intensity')
    red_intensity = models.IntegerField(db_column = 'ph_red_intensity')
    white_intensity = models.IntegerField(db_column = 'ph_white_intensity')
    lights_on_hours = models.IntegerField(db_column = 'ph_lights_on_hours') # denotes hours left on per day
    score = models.DecimalField(db_column='ph_score', max_digits=2, decimal_places=2, blank=True, null=True)
    class Meta:
        managed = True
        db_table = 'phase'

# multiple rows in the recipe tab make up a single recipe. Multiple references to a single phase can be used. ALSO, multiple Experiments can use the same recipe. So Experiment should have a reference to recipe
class Recipe(models.Model):
    id = models.AutoField(db_column='r_id', primary_key=True)  
    name = models.CharField(db_column='r_name', max_length=45, default="NO RECIPE NAME")
    phase1 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase1", db_column='r_phase1_id', blank=True, null=True)
    phase2 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase2", db_column='r_phase2_id', blank=True, null=True)
    phase3 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase3", db_column='r_phase3_id', blank=True, null=True)
    phase4 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase4", db_column='r_phase4_id', blank=True, null=True)
    phase5 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase5", db_column='r_phase5_id', blank=True, null=True)
    phase6 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase6", db_column='r_phase6_id', blank=True, null=True)
    phase7 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase7", db_column='r_phase7_id', blank=True, null=True)
    phase8 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase8", db_column='r_phase8_id', blank=True, null=True)
    phase9 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase9", db_column='r_phase9_id', blank=True, null=True)
    phase10 = models.ForeignKey("Phase", models.DO_NOTHING, related_name="phase10", db_column='r_phase10_id', blank=True, null=True)

class Plant(models.Model): # types: basil, 
    id = models.AutoField(db_column='pl_id', primary_key=True)  
    name = models.CharField(db_column='pl_name', max_length=45)  
    supplier = models.CharField(db_column = 'pl_supplier', max_length=45, blank=True, null=True)
    score = models.DecimalField(db_column='pl_score', max_digits=2, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plant'

class NutrientRecipe(models.Model): 
    id = models.CharField(db_column='nr_id', primary_key=True, max_length=45) 
    json_data = models.JSONField(db_column='nr_data')
    class Meta:
        managed = True
        db_table = 'nutrient_recipe'