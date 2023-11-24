## Google Searcher
***Google Searcher*** is a web app that acts a data scraper for google search. 
It searches in www.google.com and stores basic infos in the database along with cached response 

### Requirements
- npm >= 9.8.1
- node = 18

## Installation Guide
1. Clone repository
```bash
  git clone https://github.com/tajul-saajan/google-searcher.git
```

2. Go to project directory
```bash
  cd google-searcher 
```
3. Setup `.env` file
```bash
cp .env.example .env
```

4. Install dependencies
```bash
$ npm install
```

5. Compiling the assets
```bash
npx tailwindcss -i resources/css/main.css -o public/css/base.css
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

### Test

```bash
# unit tests
$ npm run test
```