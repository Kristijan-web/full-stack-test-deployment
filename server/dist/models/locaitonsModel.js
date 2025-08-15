// Tours i Location relationship
// Tour omze da ima vise lokacija, dok lokacija moze da pripada vise tour-a ovo je FEW:FEW
// takodje su usko povezani podaci jer nema smisla prikazivati tour bez lokacija koji ce se obilaziti, takodje nece biti potrebne da se posebno query-a lokacija
// RESENJE: embedding
export {};
// kada se pravi novi tour on ce u sebi sadrzati podatke o lokacija koje se obilaze
// Kako ce kod izgledati:
// Kada se pravi tour u locatons ce se proslediti niz id-eva lokacija, onda ce se otici do lokacija i izvucice se niz objekata na osnovu id-eva i onda ce this.locations postati niz stringova lokacija
