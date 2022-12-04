# tsumego-a-gogo

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

If you don't have it already install Python 3 (at least 3.7). Run in powershell in admin rights:
```Powershell
choco install python
```

### Postgresql
https://www.postgresql.org/
```Powershell
choco install postgresql
```

### Python dependencies
It is recommended to use a virtualenv but you can skip this step
```
pip install --user virtualenv
python -m venv env
pip install -r requirements.txt
```


## Linux
It should be the same as for windows but with your regular package manager.

Be careful to use python 3. You may need to change some commands to fit Linux command line.
