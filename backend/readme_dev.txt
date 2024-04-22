
python manage.py dumpdata recrutingapp.gender --natural-foreign > recrutingapp/fixtures/genders.json
python manage.py dumpdata recrutingapp.region --natural-foreign > recrutingapp/fixtures/regions.json
python manage.py dumpdata recrutingapp.city --natural-foreign > recrutingapp/fixtures/cities.json
python manage.py dumpdata recrutingapp.documentstatus --natural-foreign > recrutingapp/fixtures/documentstatus.json


python manage.py loaddata recrutingapp/fixtures/genders.json recrutingapp/fixtures/regions.json recrutingapp/fixtures/cities.json recrutingapp/fixtures/documentstatus.json