# gazeProPraktikum2

### Electron-React desktop aplikacija za obdelavo pdf datotek
 
Ta projekt je aplikacija Electron, ki uporablja React
front-end za prikaz in Python za obdelava PDF datotek.
Aplikacija uporabnikom omogoča nalaganje datotek PDF, 
ekstrahiranje podatkov iz njih s pomočjo skripta Python 
in prikaz ekstrahiranih podatkov v obliki tabele. 
Uporabniki lahko urejajo in brišejo vrstice iz prikazanih 
podatkovnih tabel.

### Značilnosti:
* Nalaganje datoteke PDF za obdelavo
* Ekstrahiranje podatke iz datotek PDF s skriptom Python
* Prikaz ekstrahiranih podatkov v obliki tabele
* Urejanje in brisanje vrstic podatkov
* Varna komunikacija med glavnim procesom Electron (Electron main process) in React renderer process

### Predpogoji za uporabo:
* Node.js inštaliran (v21.5.0 - različica na kateri je projekt narejen)
* Python inštaliran (pr. 3.11.4) in ustrezne knjižnice (sys, pdfplumer, pandas, json, numpy)
* npm (node package manager)

### Kako začeti:
* npm install - potrebno naredit za Electron in React da bi inštaliral potrebne package-e
* V terminal zaženi React app (folder gazeProReact)
* Zaženi tudi electron app (en folder nazaj od gazeProReact) - npm start



