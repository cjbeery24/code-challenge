
## Install Dependencies
```
composer install
npm install
```

## Create .env File
```
cp .env.example .env
php artisan key:generate
```

## Create Database

Create a mysql database called "code-challenge". 
Update .env file with username / password.
```
DB_DATABASE=code-challenge
DB_USERNAME=root
DB_PASSWORD=
```
Run migrations.
```
php artisan migrate
```

## Start Server
```
php artisan serve
```
## Compile and Serve Front End
```
npm run dev
```

## Run Queue Worker
```
php artisan queue:work
```

## Ready to go!
```
http://localhost:8000
```
