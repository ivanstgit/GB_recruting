
python manage.py dumpdata recrutingapp.gender --natural-foreign > recrutingapp/fixtures/genders.json
python manage.py dumpdata recrutingapp.region --natural-foreign > recrutingapp/fixtures/regions.json
python manage.py dumpdata recrutingapp.city --natural-foreign > recrutingapp/fixtures/cities.json
python manage.py dumpdata recrutingapp.documentstatus --natural-foreign > recrutingapp/fixtures/documentstatus.json

python manage.py dumpdata recrutingapp --natural-foreign --indent 4 > recrutingapp/fixtures/test_data.json
python manage.py dumpdata userapp --natural-foreign --indent 4 > recrutingapp/fixtures/test_users.json


python manage.py loaddata recrutingapp/fixtures/genders.json recrutingapp/fixtures/regions.json recrutingapp/fixtures/cities.json recrutingapp/fixtures/documentstatus.json


python manage.py migrate
python manage.py loaddata recrutingapp/fixtures/test_data.json