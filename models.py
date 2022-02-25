# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Device(models.Model):
    devicename = models.CharField(db_column='deviceName', primary_key=True, max_length=45)  # Field name made lowercase.
    experimentid = models.IntegerField(db_column='experimentID')  # Field name made lowercase.
    user = models.CharField(max_length=45, blank=True, null=True)
    token = models.CharField(max_length=45, blank=True, null=True)
    creationdate = models.DateTimeField(db_column='creationDate', blank=True, null=True)  # Field name made lowercase.
    lastupdate = models.DateTimeField(db_column='lastUpdate', blank=True, null=True)  # Field name made lowercase.
    isonline = models.CharField(db_column='isOnline', max_length=1, blank=True, null=True)  # Field name made lowercase.
    macaddress = models.CharField(db_column='macAddress', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'device'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Experiment(models.Model):
    experimentid = models.OneToOneField('Experimentreading', models.DO_NOTHING, db_column='experimentID', primary_key=True)  # Field name made lowercase.
    podpackid = models.ForeignKey('Podpack', models.DO_NOTHING, db_column='podPackID', blank=True, null=True)  # Field name made lowercase.
    recipename = models.ForeignKey('Recipe', models.DO_NOTHING, db_column='recipeName', blank=True, null=True)  # Field name made lowercase.
    devicename = models.ForeignKey(Device, models.DO_NOTHING, db_column='deviceName', blank=True, null=True)  # Field name made lowercase.
    experimentscore = models.DecimalField(db_column='experimentScore', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    startdate = models.DateTimeField(db_column='startDate', blank=True, null=True)  # Field name made lowercase.
    enddate = models.DateTimeField(db_column='endDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'experiment'


class Experimentreading(models.Model):
    experimentreadingid = models.AutoField(db_column='experimentReadingID', primary_key=True)  # Field name made lowercase.
    experimentid = models.IntegerField(db_column='experimentID', blank=True, null=True)  # Field name made lowercase.
    waterlevel = models.IntegerField(db_column='waterLevel', blank=True, null=True)  # Field name made lowercase.
    timestamp = models.DateTimeField(blank=True, null=True)
    watertds = models.IntegerField(db_column='waterTDS', blank=True, null=True)  # Field name made lowercase.
    waterph = models.IntegerField(db_column='waterPH', blank=True, null=True)  # Field name made lowercase.
    electricalconductance = models.IntegerField(db_column='electricalConductance', blank=True, null=True)  # Field name made lowercase.
    reservoirtds = models.IntegerField(db_column='reservoirTDS', blank=True, null=True)  # Field name made lowercase.
    reservoirph = models.IntegerField(db_column='reservoirPH', blank=True, null=True)  # Field name made lowercase.
    watertemp = models.DecimalField(db_column='waterTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    fillresflag = models.CharField(db_column='fillResFlag', max_length=1, blank=True, null=True)  # Field name made lowercase.
    airtemp = models.DecimalField(db_column='airTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    airhum = models.DecimalField(db_column='airHum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    recipestage = models.IntegerField(db_column='recipeStage', blank=True, null=True)  # Field name made lowercase.
    roomtemp = models.DecimalField(db_column='roomTemp', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    roomhum = models.DecimalField(db_column='roomHum', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    refillreservoirflag = models.CharField(db_column='refillReservoirFlag', max_length=1, blank=True, null=True)  # Field name made lowercase.
    photo = models.CharField(max_length=100, blank=True, null=True)
    nutrientscore = models.DecimalField(db_column='nutrientScore', max_digits=2, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'experimentReading'


class Plant(models.Model):
    plantid = models.AutoField(db_column='plantID', primary_key=True)  # Field name made lowercase.
    plantname = models.CharField(db_column='plantName', max_length=45)  # Field name made lowercase.
    supplier = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plant'


class Pod(models.Model):
    podid = models.AutoField(db_column='podID', primary_key=True)  # Field name made lowercase.
    experimentid = models.CharField(db_column='experimentID', max_length=45, blank=True, null=True)  # Field name made lowercase.
    podreading = models.CharField(db_column='podReading', max_length=45, blank=True, null=True)  # Field name made lowercase.
    plantid = models.ForeignKey(Plant, models.DO_NOTHING, db_column='plantID', blank=True, null=True)  # Field name made lowercase.
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pod'


class Podpack(models.Model):
    podpackid = models.AutoField(db_column='podPackID', primary_key=True)  # Field name made lowercase.
    experimentid = models.ForeignKey(Experiment, models.DO_NOTHING, db_column='experimentID')  # Field name made lowercase.
    podid = models.ForeignKey(Pod, models.DO_NOTHING, db_column='podID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'podPack'


class Recipe(models.Model):
    recipename = models.CharField(db_column='recipeName', primary_key=True, max_length=45)  # Field name made lowercase.
    recipedata = models.CharField(db_column='recipeData', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'recipe'
