# tsumego-a-gogo

Development TODO
- TODO upload several tsumegos in a zip file

Before launching TODO
- TODO remove migrations from gitignore when development ends
- TODO change secret to real secret
- TODO production checklist in general

# Installation

## Windows

## Method 1 with package manager
You can install the choco package manager for windows
https://chocolatey.org/

If you don't want to install choco you can manually download everything you don't have yet.

Installation: 
https://chocolatey.org/install

### Python
https://www.python.org/

If you don't have it already install Python 3 (at least 3.8). Run in powershell in admin rights:
```Powershell
choco install python
```

### Postgresql
https://www.postgresql.org/
```Powershell
choco install postgresql --params '/Password:type_your_password
```
Then you can create a database and a tsumegogogo user dev user.
This is only for development purpose.
First connect to a psql shell in a non admin powershell.
```
psql -U postgres
```
Once in the psql shell create the database and add the dev user.
Then connect to the new database and give rights to tsumegogogo.
```
CREATE DATABASE "tsumegogogo-db";
CREATE USER tsumegogogo WITH CREATEDB;
ALTER USER tsumegogogo WITH PASSWORD 'tsumegogogo';
\c tsumegogogo-db
GRANT ALL ON SCHEMA public TO tsumegogogo;
```

### Python dependencies
It is recommended to use a virtualenv but you can skip this step.
Install it if you don't have already:
```
pip install --user virtualenv
```
Then init a virtualenv in the project directory and activate it:
```
python -m venv env
.\env\Scripts\activate
```
Anyway you will need to install the Python dependencies:
```
pip install -r requirements.txt
```

### Install the frontend (not needed yet)

Install Node version manager for windows https://github.com/coreybutler/nvm-windows. Then update nodejs.

```
nvm install latest
nvm use 19.7.0
```
19.7.0 may change depending on the installed version.



Install React 

## Linux
It should be the same as for windows but with your regular package manager.

Be careful to use python 3. You may need to change some commands to fit Linux command line.

# Run
Before your first run you should apply the migrations (and after every time the database change).
```
python manage.py migrate
```
You also need to create your local superadmin (use the username and password you want).
```
python manage.py createsuperuser
```
You can run the development server with:
```
python manage.py runserver
```

# Folder hierarchy
- `frontend` see in the frontend directory specific folders.
- `backend` Django app to aggregate all the other backend apps into a single API.
- `tsumego_core` backend django app to store tsumegos in the database. SGF facilities are also found here.