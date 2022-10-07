# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

"""
OVERALL FILE PURPOSE: DEFINES ALL MODELS IN OUR SQL DATABASE.
CHANGES MADE HERE CAN AFFECT THE DATABASE DIRECTLY VIA TERMINAL COMMANDS:
python manage.py makemigrations
python manage.py migrate
"""

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

PERCENTAGE_VALIDATOR = [MinValueValidator(0), MaxValueValidator(100)]

# https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react
# https://djangoadventures.com/how-to-integrate-django-with-existing-database/

class Device(models.Model):
    id = models.CharField(db_column='d_id', max_length=255, primary_key=True)
    model = models.CharField(db_column='d_model', max_length=45, blank=True, null=True) 
    name = models.CharField(db_column='d_name', max_length=45, blank=True, null=True)  
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='d_user_id', on_delete=models.CASCADE, blank=True, null=True)  
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
    day = models.IntegerField(db_column='e_day', default = 0) 
    phase = models.ForeignKey("Phase", models.DO_NOTHING, related_name='+', db_column='e_phase_id',blank=True, null=True) # germination, seedling, vegetative growth, flowering, fruiting, other1, terminated, complete
    phase_day = models.IntegerField(db_column='e_phase_day', default = 0) 
    phase_number = models.IntegerField(db_column='e_phase_number', default = 0) 
    device = models.ForeignKey("Device", models.DO_NOTHING, related_name='+', db_column='e_device_id', blank=False, null=False)  
    # this score not filled until end of experiment
    score = models.DecimalField(db_column='e_score', max_digits=2, decimal_places=2, blank=True, null=True) # score should be the averaged score of all pod Experiment Readings
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='e_user_id', on_delete=models.CASCADE, blank=True, null=True)  
    start_date = models.DateTimeField(db_column='e_start_date', blank=True, null=True) 
    end_date = models.DateTimeField(db_column='e_end_date', blank=True, null=True)  
    recipe = models.ForeignKey("Recipe", models.DO_NOTHING, related_name='+', db_column='e_recipe_id',blank=True, null=True)
    status = models.IntegerField(db_column='e_status', default = 0) # 0 = active, 1 = terminated, 2 = concluded

    class Meta:
        managed = True
        db_table = 'experiment'

# many readings per experiment - is written by a user to the db in reference to an experiment
class ExperimentReading(models.Model):
    id = models.AutoField(db_column='er_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", on_delete=models.CASCADE, db_column='er_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    water_level = models.IntegerField(db_column='er_water_level', blank=True, null=True) 
    reading_date = models.DateTimeField(db_column='er_reading_date', auto_now_add=True)
    electrical_conductance = models.IntegerField(db_column='er_electrical_conductance', blank=True, null=True) 
    reservoir_ph = models.DecimalField(db_column='er_reservoir_ph', max_digits=3, decimal_places=1, blank=True, null=True) 
    experiment_phase = models.IntegerField(db_column='er_experiment_phase', blank=True, null=True) 
    temperature = models.IntegerField(db_column='er_temperature', blank=True, null=True) 
    humidity = models.IntegerField(db_column='er_humidity', blank=True, null=True, validators=PERCENTAGE_VALIDATOR)

    # Event Bools
    flushed_reservoir = models.BooleanField(db_column='er_flushed_reservoir', default = 0)
    raised_light = models.BooleanField(db_column='er_raised_light', default = 0)
    failed_pump = models.BooleanField(db_column='er_failed_pump', default = 0)

    class Meta:
        managed = True
        db_table = 'experiment_reading'

# manual intervention object: prune, water, nutrient, dome, trellis, raising light,  <- pod phase (germination, sprouted, harvest,  etc) needs to be recorded
# lighting in intensity (0 -> 1) range (for now); later PPFD

# pest_coverage, algae_coverage,blight_coverage default set to results of previous reading. Quantize to 4 , no numeric inputs, just happy faces

# many readings per experiment - is written by a user to the db in reference to an experiment
class PodReading(models.Model):
    id = models.AutoField(db_column='pr_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", on_delete=models.CASCADE, db_column='pr_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    pod = models.ForeignKey("Pod", on_delete=models.CASCADE, db_column='pr_pod_id', blank=True, null=True)
    experiment_reading = models.ForeignKey("ExperimentReading", on_delete=models.CASCADE, db_column='pr_experiment_reading_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    comment = models.CharField(db_column='pr_comment', max_length=255, blank=True, null=True)
    score = models.DecimalField(db_column='pr_score', max_digits=5, decimal_places=2, blank=True, null=True)

    # Event Bools
    removed_dome = models.BooleanField(db_column='pr_removed_dome', default = 0)
    pollinated = models.BooleanField(db_column='pr_pollinated', default = 0)
    trellis_adjustment = models.BooleanField(db_column='pr_trellis_adjustment', default = 0)
    pest_removal = models.BooleanField(db_column='pr_pest_removal', default = 0)

    # Pruning Bools
    prune_thinned = models.BooleanField(db_column='pr_prune_thinned', default = 0)
    prune_topped = models.BooleanField(db_column='pr_prune_topped', default = 0)
    prune_dead_foliage = models.BooleanField(db_column='pr_prune_dead_foliage', default = 0)
    prune_living_foliage = models.BooleanField(db_column='pr_prune_living_foliage', default = 0)
    prune_dead_heading = models.BooleanField(db_column='pr_prune_dead_heading', default = 0)

    # Stats
    node_count = models.IntegerField(db_column='pr_node_count', blank=True, null=True) 
    internode_distance = models.DecimalField(db_column='pr_internode_distance', max_digits=5, decimal_places=2, blank=True, null=True) 
    leaf_count = models.IntegerField(db_column='pr_leaf_count', blank=True, null=True) 
    germination_rate = models.IntegerField(db_column='pr_germination_rate', blank=True, null=True, validators=PERCENTAGE_VALIDATOR) 
    days_to_germinate = models.IntegerField(db_column='po_days_to_germinate', blank=True, null=True) 

    pod_phase = models.CharField(db_column='pr_pod_phase', max_length=45, blank=True, null=True)
    media_to_bgp = models.DecimalField(db_column='pr_media_to_bgp', max_digits=5, decimal_places=2, blank=True, null=True)
    min_height = models.DecimalField(db_column='pr_min_height', max_digits=5, decimal_places=2, blank=True, null=True)
    max_height = models.DecimalField(db_column='pr_max_height', max_digits=5, decimal_places=2, blank=True, null=True)
    leaf_area_avg = models.DecimalField(db_column='pr_leaf_area_avg', max_digits=5, decimal_places=2, blank=True, null=True)

    pest_coverage = models.IntegerField(db_column='pr_pest_coverage', default=False, validators=PERCENTAGE_VALIDATOR, blank=True, null=True) 
    algae_coverage =  models.IntegerField(db_column='pr_algae_coverage', default=False, validators=PERCENTAGE_VALIDATOR, blank=True, null=True)  
    blight_coverage = models.IntegerField(db_column='pr_blight_coverage', default=False, validators=PERCENTAGE_VALIDATOR, blank=True, null=True)  

    bud_count = models.IntegerField(db_column='pr_bud_count', blank=True, null=True)
    flower_count = models.IntegerField(db_column='pr_flower_count', blank=True, null=True)
    flower_quality = models.IntegerField(db_column='pr_flower_quality', blank=True, null=True, validators=PERCENTAGE_VALIDATOR)  
    fruit_unripe_count = models.IntegerField(db_column='pr_fruit_unripe_count', blank=True, null=True)
    fruit_ripe_count = models.IntegerField(db_column='pr_fruit_ripe_count', blank=True, null=True)
    harvest_count = models.IntegerField(db_column='pr_harvest_count',  blank=True, null=True)  
    harvest_weight = models.DecimalField(db_column='pr_harvest_weight', max_digits=5, decimal_places=2, blank=True, null=True)
    harvest_quality = models.IntegerField(db_column='pr_harvest_quality',blank=True, null=True, validators=PERCENTAGE_VALIDATOR)  
    image_link = models.URLField(db_column='pr_image_link', max_length = 200, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pod_reading'


class Pod(models.Model):
    id = models.AutoField(db_column='po_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", on_delete=models.CASCADE, db_column='po_experiment_id')  # pods created automatically when an experiment is created
    plant = models.ForeignKey("Plant", on_delete=models.PROTECT, db_column='po_plant_id', null=True)  # type of plant for this pod 
    seeds_planted = models.IntegerField(db_column = 'po_seeds_planted', blank=True, null=True)
    position = models.IntegerField(db_column = 'po_position', blank=True, null=True) # position of pod in byte
    phase = models.IntegerField(db_column = 'po_phase', default = 0) #planted = 0, sprouted = 1, true leaves = 3, harvested = 4, died early = 5
    score = models.DecimalField(db_column='po_score', max_digits=2, decimal_places=2, blank=True, null=True) # Averaged score of Experiment Readings for a specific pod
    start_date = models.DateTimeField(db_column='po_start_date', blank=True, null=True) # start date is 
    end_date = models.DateTimeField(db_column='po_end_date', blank=True, null=True)  
    status = models.IntegerField(db_column='po_status', default = 0) # 0 = active, 1 = terminated, 2 = concluded
    
    class Meta:
        managed = True
        db_table = 'pod'

# A phase are used by a single recipe
class Phase(models.Model): # generic periodic phase setting to be used by a recipe 
    id = models.AutoField(db_column='ph_id', primary_key=True)  
    recipe = models.ForeignKey("Recipe", on_delete=models.SET_NULL, db_column='ph_recipe_id', null=True)  # pods created automatically when an experiment is created
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

# multiple rows in the recipe tab make up a single recipe. multiple Experiments can use the same recipe. So Experiment should have a reference to recipe
class Recipe(models.Model):
    id = models.AutoField(db_column='r_id', primary_key=True)  
    name = models.CharField(db_column='r_name', max_length=45, default="NO RECIPE NAME")
    recipe_json = models.JSONField(db_column='r_recipe_json', blank=True, null=True)
    days = models.IntegerField(db_column = 'r_days')
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
    author = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='r_user_id', on_delete=models.CASCADE, blank=True, null=True) 

    class Meta:
        managed = True
        db_table = 'recipe'

class Plant(models.Model): # types: basil, 
    id = models.CharField(db_column='pl_id', max_length=255, primary_key=True)
    name = models.CharField(db_column='pl_name', max_length=45, blank=True, null=True) 
    species = models.CharField(db_column='pl_species', max_length=45, blank=True, null=True)  
    genus = models.CharField(db_column='pl_genus', max_length=45, blank=True, null=True)      
    profile = models.CharField(db_column='pl_profile', max_length=1024, blank=True, null=True)
    growing_tips = models.CharField(db_column='pl_growing_tips', max_length=1024, blank=True, null=True)
    harvesting_tips = models.CharField(db_column='pl_harvesting_tips', max_length=1024, blank=True, null=True)

    ideal_ph_min = models.DecimalField(db_column='pl_ideal_ph_min', max_digits=2, decimal_places=2,  blank=True, null=True) 
    ideal_ph_max = models.DecimalField(db_column='pl_ideal_ph_max',  max_digits=2, decimal_places=2, blank=True, null=True) 
    ideal_ec_min = models.DecimalField(db_column='pl_ideal_ec_min', max_digits=2, decimal_places=2,  blank=True, null=True) 
    ideal_ec_max = models.DecimalField(db_column='pl_ideal_ec_max', max_digits=2, decimal_places=2,  blank=True, null=True) 
    ideal_water_temp_min = models.IntegerField(db_column='pl_ideal_water_temp_min', blank=True, null=True) 
    ideal_water_temp_max = models.IntegerField(db_column='pl_ideal_water_temp_max', blank=True, null=True) 
    ideal_temp_min = models.IntegerField(db_column='pl_ideal_temp_min', blank=True, null=True) 
    ideal_temp_max = models.IntegerField(db_column='pl_ideal_temp_max', blank=True, null=True) 
    ideal_humidity_min = models.IntegerField(db_column='pl_ideal_humidity_min', validators=PERCENTAGE_VALIDATOR, blank=True, null=True) 
    ideal_humidity_max = models.IntegerField(db_column='pl_ideal_humidity_max', validators=PERCENTAGE_VALIDATOR, blank=True, null=True) 
    ideal_days_to_sprout_min = models.IntegerField(db_column='pl_ideal_days_to_sprout_min', blank=True, null=True) 
    ideal_days_to_sprout_max = models.IntegerField(db_column='pl_ideal_days_to_sprout_max', blank=True, null=True) 
    ideal_days_to_harvest = models.IntegerField(db_column='pl_ideal_days_to_harvest', blank=True, null=True) 

    days_to_sprout_min = models.IntegerField(db_column='pl_days_to_sprout_min', blank=True, null=True) 
    days_to_sprout_max = models.IntegerField(db_column='pl_days_to_sprout_max', blank=True, null=True) 

    days_to_harvest_min = models.IntegerField(db_column='pl_days_to_harvest_min', blank=True, null=True) #how many days passed until first harvest occurred
    days_to_harvest_max = models.IntegerField(db_column='pl_days_to_harvest_max', blank=True, null=True) #how many days passed until first harvest occurred

    germination_rate = models.IntegerField(db_column='pl_germination_rate', blank=True, null=True, validators=PERCENTAGE_VALIDATOR) # this is a percentage

    bgp_distance_min = models.IntegerField(db_column='pl_bgp_distance_min', blank=True, null=True) 
    bgp_distance_max = models.IntegerField(db_column='pl_bgp_distance_max', blank=True, null=True) 
    
    final_height_min = models.IntegerField(db_column='pl_final_height_min', blank=True, null=True) 
    final_height_max = models.IntegerField(db_column='pl_final_height_max', blank=True, null=True) 

    node_count_min = models.IntegerField(db_column='pl_node_count_min', blank=True, null=True) 
    node_count_max = models.IntegerField(db_column='pl_node_count_max', blank=True, null=True) 

    internode_distance_min = models.IntegerField(db_column='pl_internode_distance_min', blank=True, null=True) 
    internode_distance_max = models.IntegerField(db_column='pl_internode_distance_max', blank=True, null=True) 

    final_leaf_count_min = models.IntegerField(db_column='pl_final_leaf_count_min', blank=True, null=True) 
    final_leaf_count_max = models.IntegerField(db_column='pl_final_leaf_count_max', blank=True, null=True) 

    final_leaf_area_min = models.IntegerField(db_column='pl_final_leaf_area_min', blank=True, null=True) #how many days passed until first harvest occurred
    final_leaf_area_max = models.IntegerField(db_column='pl_final_leaf_area_max', blank=True, null=True) #how many days passed until first harvest occurred

    bud_count_min = models.IntegerField(db_column='pl_bud_count_min', blank=True, null=True)
    bud_count_max = models.IntegerField(db_column='pl_bud_count_max', blank=True, null=True)

    flower_count = models.IntegerField(db_column='pl_flower_count', blank=True, null=True)
    flower_quality = models.IntegerField(db_column='pl_flower_quality', blank=True, null=True, validators=PERCENTAGE_VALIDATOR)  
    fruit_unripe_count = models.IntegerField(db_column='pl_fruit_unripe_count', blank=True, null=True)
    fruit_ripe_count = models.IntegerField(db_column='pl_fruit_ripe_count', blank=True, null=True)
    harvest_count = models.IntegerField(db_column='pl_harvest_count', blank=True, null=True)  
    harvest_weight = models.DecimalField(db_column='pl_harvest_weight', max_digits=5, decimal_places=2, blank=True, null=True)
    harvest_quality = models.IntegerField(db_column='pl_harvest_quality', blank=True, null=True, validators=PERCENTAGE_VALIDATOR)  

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