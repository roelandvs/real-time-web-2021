# Real-Time Poker App
Ik wil een realtime poker spel maken. Je kunt dus in een room komen met (willekeurige?) tegenstanders. Deze rooms zullen een beperkt aantal(8) personen binnen laten zodat het niet te druk zal worden. Verder moet er natuurlijk voldaan worden aan alle regels van poker. Het moet in de basis dus mogelijk zijn om te:
- Folden
- Callen
- Raisen

Ook zal er rekening gehouden worden met de small en big blind, en dat de beurt roteert. De winnaar zal aan het einde de pot winnen en dit geld wordt aan zijn rekening toegevoegd. Dit zal dus ook in een database moeten worden opgeslagen.

<br/>

# Schetsen
## Schets 1
![poker1](https://user-images.githubusercontent.com/59770136/114394895-05d54b00-9b9c-11eb-9baa-c912babde2b9.jpeg)
- Je eigen kaarten zijn duidelijk (+)
- Iedereen moet zelf z'n first perspective hebben (-)

## Schets 2
![poker2](https://user-images.githubusercontent.com/59770136/114394936-138ad080-9b9c-11eb-9a30-990476ca729f.jpeg)
- De hand ziet er indrukwekkend uit (+)
- Origineel (+)
- Neemt wellicht te groot aandeel van scherm in (-)
- Lastig responsive (-)
- Maakt perspectief verschil tussen tafel en hand erg groot (-)

## Schets 3
![poker3](https://user-images.githubusercontent.com/59770136/114394948-15549400-9b9c-11eb-8f1a-c5f0f94a8616.jpeg)
- Overzichtelijk (+)
- Minst lastig te developen (+)
- Als je kaarten wil laten zien aan het einde van de ronde kan dit makkelijk (+)

<br/>

# API's
Om mijn poker spel te realisteren maak ik gebruik van twee verschillende API's. Zonder deze API's zou het nog steeds mogelijk zijn om deze applicatie te maken, maar deze API's maken het aanzienlijk makkelijker om de app te realiseren.

## Poker API
Deze poker API weergeeft wie de winnaar in van de poker ronde. Hierdoor hoef ik zelf niet de poker regels te programmeren. Deze API heeft een zeer beperkte documentatie. Het onbekend welke `endpoints` je kunt aanspreken en wat de `rate limit` is van de API. [Link naar API](https://www.pokerapi.dev/)

De request naar deze API moet je wat informatie meegeven:
- `table cards` (de 5 kaarten van de river)
- `player cards` (alle kaarten van de spelers)

### Request en Response
Vervolgens geeft de API in de response aan welke kaarten van de winnaar zijn, en wat iedere speler had als resultaat. 
Dit is een voorbeeld van een request:
```js
let url = 'https://api.pokerapi.dev/v1/winner/texas_holdem?cc=AC,KD,QH,JS,7C&pc[]=10S,8C&pc[]=3S,2C&pc[]=QS,JH'
```

En dit geeft de API als response terug:
```js
{
  winners: [
    {
      cards: "10S,8C",
      hand: "10S,JS,QH,KD,AC",
      result: "straight"
    }
  ],
  players: [
    {
      cards: "10S,8C",
      hand: "10S,JS,QH,KD,AC",
      result: "straight"
    },
    {
      cards: "3S,2C",
      hand: "7C,JS,QH,KD,AC",
      result: "high_card"
    },
    {
      cards: "QS,JH",
      hand: "JH,JS,QH,QS,AC",
      result: "two_pair"
    }
  ]
}
```

## Card Deck API
Card Deck API is een API die een digitaal kaartendeck voor je bij houdt. Je kunt naar deze API verschillende soorten requests sturen die een bepaalde functie uitvoeren op het kaartendeck dat je gebruikt.

Zo kun je met deze API deze handelingen uitvoeren:
- `Shuffle the Cards`
- `Draw a Card`
- `Reshuffle the Cards`
- `A Brand New Deck`
- `A Partial Deck`
- `Create Pile`
- `Shuffle Piles`
- `Listing Cards in Piles`
- `Drawing from Piles`

Wederom is het niet bekend wat de `rate limit` is van de API.

### Request and Response
Dit voorbeeld toont het `Shuffle the Cards` request waarbij je een geschud deck krijgt.
Dit is de request:
```js
let url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
```

En dit geeft de API als response terug:
```js
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "shuffled": true,
    "remaining": 52
}
```
Vervolgens kun je het `deck_id` gebruiken in een nieuw request om handelingen uit te voeren op dat specifieke deck.

<br/>

# MoSCoW
## Must
- Naam tonen
- Poker regels toepassen
- Keuze maken tussen (fold, check en raise)
- Rooms maken

## Should
- Login
- Geld bijhouden op account
- Geld 'bijkopen' als je niks meer hebt

## Could
- Je vrienden uitnodigen voor een room
- Animaties toepassen op kaarten
- Eigen avatar maken, die vervolgens aan tafel zit
- Op mobiel werken

## Want to have, but not this time
- Echt geld kunnen storten
- Dingen

<br/>

# Graph
![Screenshot 2021-04-12 at 16 08 28](https://user-images.githubusercontent.com/59770136/114408615-e2190180-9ba9-11eb-8891-db87c52e9fe2.png)

<br/>

## Installation guide
Create a directory using your terminal:
```
mkdir <directory name>
```

Navigate to the directory:
```
cd <directory name>
```

Install this project:
```
git clone https://github.com/roelandvs/real-time-web-2021.git
```

Move to directory:
```
cd real-time-web-2021
```

Install dependencies:
```
npm init
```
