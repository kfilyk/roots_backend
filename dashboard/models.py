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
    name = models.CharField(db_column='d_name', max_length=45, blank=True, null=True)  # Field name made lowercase.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='d_user_id', on_delete=models.CASCADE, blank=True, null=True)  # Field name made lowercase.
    token = models.CharField(max_length=45, blank=True, null=True)
    registration_date = models.DateTimeField(db_column='d_registration_date', auto_now_add=True)  # Field name made lowercase.
    last_update = models.DateTimeField(db_column='d_last_update', blank=True, null=True)  # Field name made lowercase.
    is_online = models.BooleanField(db_column='d_is_online', default=False)  # Field name made lowercase. This field type is a guess.
    mac_address = models.CharField(db_column='d_mac_address', max_length=45, blank=True, null=True)  # Field name made lowercase.
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, related_name='+', db_column='d_experiment_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'device'

class Experiment(models.Model):
    id = models.AutoField(db_column='e_id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='e_description', max_length=255, blank=True, null=True)
    recipe = models.ForeignKey("Recipe", models.DO_NOTHING, db_column='e_recipe_id', blank=True, null=True)  # Field name made lowercase.
    device = models.ForeignKey("Device", models.DO_NOTHING, related_name='+', db_column='e_device_id', blank=True, null=True)  # Field name made lowercase.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='e_user_id', on_delete=models.CASCADE, blank=True, null=True)  # Field name made lowercase.
    score = models.DecimalField(db_column='e_score', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    start_date = models.DateTimeField(db_column='e_start_date', blank=True, null=True)  # Field name made lowercase.
    end_date = models.DateTimeField(db_column='e_end_date', blank=True, null=True)  # Field name made lowercase.
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

# many experiment readings per one experiment
class ExperimentReading(models.Model):
    id = models.AutoField(db_column='er_id', primary_key=True)  # Field name made lowercase.
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='er_experiment_id', blank=True, null=True)  # delete experiment readings if experiment is deleted
    water_level = models.IntegerField(db_column='er_water_level', blank=True, null=True)  # Field name made lowercase.
    reading_date = models.DateTimeField(db_column='er_reading_date', auto_now_add=True)
    water_tds = models.IntegerField(db_column='er_water_tds', blank=True, null=True)  # Field name made lowercase.
    water_ph = models.IntegerField(db_column='er_water_ph', blank=True, null=True)  # Field name made lowercase.
    electrical_conductance = models.IntegerField(db_column='er_electrical_conductance', blank=True, null=True)  # Field name made lowercase.
    reservoir_tds = models.IntegerField(db_column='er_reservoir_tds', blank=True, null=True)  # Field name made lowercase.
    reservoir_ph = models.IntegerField(db_column='er_reservoir_ph', blank=True, null=True)  # Field name made lowercase.
    water_temp = models.DecimalField(db_column='er_water_temp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    fill_res_flag = models.BooleanField(db_column='er_fill_res_flag', default=False)  # Field name made lowercase. This field type is a guess.
    air_temp = models.DecimalField(db_column='er_air_temp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    air_hum = models.DecimalField(db_column='er_air_hum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    recipe_stage = models.IntegerField(db_column='er_recipe_stage', blank=True, null=True)  # Field name made lowercase.
    room_temp = models.DecimalField(db_column='er_room_temp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    room_hum = models.DecimalField(db_column='er_room_hum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    refill_reservoir_flag = models.BooleanField(db_column='er_refill_reservoir_flag', default=False)  # Field name made lowercase. This field type is a guess.
    photo_link = models.CharField(db_column='er_photo_link', max_length=100, blank=True, null=True)
    nutrient_score = models.DecimalField(db_column='er_nutrient_score', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'experiment_reading'


class Plant(models.Model):
    id = models.AutoField(db_column='pl_id', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='pl_name', max_length=45)  # Field name made lowercase.
    supplier = models.CharField(db_column = 'pl_supplier', max_length=45, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plant'


class Pod(models.Model):
    id = models.AutoField(db_column='po_id', primary_key=True)  
    experiment = models.ForeignKey("Experiment", models.DO_NOTHING, db_column='er_experiment_id')  # Can only create pods when there is an experiment to link to it
    plant = models.ForeignKey(Plant, models.DO_NOTHING, db_column='po_plant_id', blank=True, null=True)  # type of plant for this pod
    position = models.IntegerField(db_column = 'po_position', blank=True, null=True) # position of pod in byte

    class Meta:
        managed = True
        db_table = 'pod'

class Recipe(models.Model):
    id = models.CharField(db_column='r_id', primary_key=True, max_length=45)  # Field name made lowercase.
    data = models.CharField(db_column='r_data', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'recipe'

## eventually build pod_reading here