================================================
Prepare for prod (than transfer to git)
================================================
backend:
poetry export -f requirements.txt --output requirements.txt --without dev --without-hashes
frontend:
npm run build

================================================
Deployment (from git to docker-ready VM)
================================================
1. transfer src
git clone ...
2. update secrets
1) generate django key from root folder (only first time):
openssl rand -base64 40 >> secrets/django_secret_key.txt
2) update files in secrets folder (allowed_hosts - your server hostname)
3) update frontend/.env/production (REACT_APP_API_URL=http://<your server hostname>:8000/api
3. build and run
sudo docker-compose up --build
================================================
Prepare machine for dev 
================================================
Prepare back:
poetry install
poetry run python manage.py migrate
poetry run python manage.py createsuperuser

prepare front
npm install axios
npm install react-router-dom
================================================
Prepare dev or test
================================================
backend:
poetry run python manage.py usergroups -m create
poetry run python manage.py testusers -m create
poetry run python manage.py test

================================================
front start:
npm run start

back start:
poetry run python manage.py runserver


================================================
Initial steps (do not use, for information only!)
------------------------------------------------
1. install pyenv
2. install poetry 
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
pyenv install 3.9.11
pyenv local 3.9.11
poetry init

poetry run python manage.py makemigrations
------------------------------------------------
1. install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
?? npm install

==
????
node install -g npx
npx create-react-app frontend
