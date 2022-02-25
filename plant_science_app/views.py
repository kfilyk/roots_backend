from django.http import HttpResponse


def platform(request):
    return HttpResponse("Hello, world.")