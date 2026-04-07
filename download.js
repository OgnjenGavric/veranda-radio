import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Podešavanje __dirname za ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- KONFIGURACIJA ---
const FOLDER_NAME = "RESTORAN_VERANDA_Standard";
const musicFolder = path.join(__dirname, FOLDER_NAME, 'muzika');
const jsonFilePath = path.join(__dirname, FOLDER_NAME, 'playlist.json');

// Lista linkova
const rawLinks = [
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/Nubiyan%20Twist%20-%20Lights%20Out.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODI1MzQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ0NDksInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.15D67MAng9mrzAKqP5v6Kh1C2cQ_KlxsvqNt4aN8CHA",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Naked%20%20Maryn%20Charlie.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODMwOTcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIwNTMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.l9SgUm4NoBKu6G864ecrSXlSbKhyGUcucPW3vVbfuM4",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Art%20Company%20-%20Susanna.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODc4MTksImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ2NTYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.BMBRTOPXkbi1qDIwdOf1m1748pSCyi0MlJ7TOBFXGJQ",
    "https://cdn.bizz-radio.net/2010's%20Hits/Pitbull%20-%20Give%20Me%20Everything%20(feat.%20Ne-Yo,%20Afrojack%20&%20Nayer).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODc4NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjo2Nzk2MCwidHlwZSI6ImNvbnRlbnQiLCJ1c2VyX3BsYXlsaXN0X2lkIjoyNTEwfQ.RclQ_w0GVrhcDp1s9xzkUruCNdMdpYeqTB2o7mkM6jI",
    "https://cdn.bizz-radio.net/VA%20-%20Movie%20Soundtrack%20Classics%20by%20M/Portugal.%20The%20Man%20-%20Feel%20It%20Still.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODc4NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzQ5NSwidHlwZSI6ImNvbnRlbnQiLCJ1c2VyX3BsYXlsaXN0X2lkIjoyNTEwfQ.7_-BJiNNpkQjweQQo6DVFWIOe1-uk9d9UEHy0YSJOKk",
    "https://cdn.bizz-radio.net/2010's%20Hits/Major%20Lazer%20-%20Lean%20On%20(feat.%20M%C3%98%20&%20DJ%20Snake).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODc4OTQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjo2NzkyMCwidHlwZSI6ImNvbnRlbnQiLCJ1c2VyX3BsYXlsaXN0X2lkIjoyNTEwfQ.f3Dt-TXeKafa4Jobq2WqZrd7tgw-iVKlSh4Hw8u-x4c",
    "https://cdn.bizz-radio.net/Parla%20Italiano/01%20Eclissi%20del%20cuore%20(feat.%20Nek).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODgwNDIsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyNDEzMDUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjQzNDh9.olTAZH3T6uubdWFoNTMquytTT_Fg4VWr1V3YJKRdOWU",
    "https://cdn.bizz-radio.net/Parla%20Italiano/01%20Strada%20facendo.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODgwNDIsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyNDEzMTEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjQzNDh9.EqBm7WhKtUTX-NAu6Iv3eF6wbawMElXLXqi3o4nW1rU",
    "https://cdn.bizz-radio.net/Parla%20Italiano/Se%20m'innamoro%20%20Ricchi%20E%20Poveri.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0ODgxMDEsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyNDE1NDUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjQzNDh9.fUSrhTWVskVW8-ZYrkIve0B4NnMxG8tyMdRsACF6RAs",
    "https://cdn.bizz-radio.net/Pop-Folk%201/01%20Folija.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTAxNDYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMDE3NzcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MTU1NzZ9.GRxG7PdChX4AUgK9b_bkI396mMKTEF2G99f1f8x-AUY",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Gabrielle%20-%20Stay%20The%20Same.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTcyNTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYwNjgsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.oLGjreXKq2SRcMptXL1eI1Mzo4bULc8DVoiZrbgpkGU",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Bijelo%20dugme%20-%20Bitanga%20I%20Princeza%20(Single)%20(Abbey%20Road%20Remastered%202014).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTcyNTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU3NjgsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.m4jQC2itOW-8kASISzkEebTbeQfDAR_Kgv8W_P4ejbA",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Comfort%20In%20A%20Crowd%20%20Retrofile.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc0NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ2ODYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.XbSnctL6YHNJ_j554czyK0Y_TqcX7H4NLXNFGB7mAgE",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/The%20Style%20Council%20-%20Shout%20To%20The%20Top.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc0NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODY0ODYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.4Rbe4Fn0g6YuSBSqME8nRD1G368IfxqooSzmTSZdl2A",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/No%20Complaints.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc0OTIsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzI1MDQsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.n-cZjjYUcKTEqQ_1Ius04pxok5DFu2enw2dc6n6YOYc",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/03%20Rudar.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc0OTIsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUxMzYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.JLWKcDDw3aOuuHgHqmK6NDjxy9KlClsWzKPLfuID6Yo",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/Faith%20No%20More%20-%20Easy.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MDQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQzNTQsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.mknE26eH_xkXsVFjuJJE2N_RXvn98ZyFw29JHbPuQ98",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Take%20That%20-%20Giants.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MDQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYyMDgsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.OduuGVPDy7aarBVSM22MiUNARFzFShULhxk1_gyzIv0",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Crvena%20Jabuka%20-%20Tamo%20Gdje%20Ljubav%20Po%C4%8Dinje.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU3NzcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.mObcLIhM7uzWKs0i4UTUM8jkmPoyTUYeEMtdSl0zYg0",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/07%20I%20Put%20a%20Spell%20on%20You.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ1NzUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.U7YkOHrANNfFl6_mU9OLRWlG3Jfyx1iXvCis1UxqQPE",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Sword%20from%20the%20Stone%20%20Passenger.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODY0NzAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.tonZREjA1BhHHKnXKG5NY179wjzhMk7Tf3QfBCu-9Ao",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/Why%20Don't%20We%20-%208%20Letters.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzI1NzUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.51Ox8AqdK0ljY_-6WOH_ah0DzBNpvQkjLV386MFkcbc",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/01%20Ljubav%20bez%20dodira.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUxMTAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.m3v0yiZ88KfqEPttW1GOLSeaOdDqGeuxl279_IAKomQ",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/mr%20president%20featuring%20mr%20day%20-%20love%20&%20happiness.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1MzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMTIzOTYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.HTlL60aMbuMNSyOK-WQbLGE3NQzRct6qdU3Yu2ndLH8",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Michael%20Bubl%C3%A9%20-%20Haven't%20Met%20You%20Yet.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NDYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYxNTMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.kH4qDcKSceDj3UUYu5tq6rtLbhCA5Z0cIulvqQI-lxk",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/09%20Dane%20brojim.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NDYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU3MjYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.VPml-AEtzjhaO93xlhTttLRsPvgKE9_BrRlvwWLVZ6c",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Tina%20Turner%20-%20Missing%20You.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NTQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMTY1NzIsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.-CS0IvAh5787_qSvL_X3UClwOl3kGWMaeMFoaTlIsQM",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Leave%20Me%20Alone%20%20Niiasii.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NTQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIwOTYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.4Hh6Nae5iOjwlhHAmLLZfHgM_UCEvQFcyyl0p-5ikLk",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/03%20I%20Love%20You%20Always%20Forever.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NjMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIyOTAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.8z1bCjb47KOsPEPqZQdgbZu_TG1Jku44H_9JmO08r24",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/Moj%20je%20%C5%BEivot%20moja%20pjesma%20%20Maya%20Sar,%20Nina%20Badric,%20Karolina%20Goceva,%20Aleksandra%20Radovi%C4%87.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NjMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzc5NjcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.59upBp0PJfreFKNOPTWF1OtgSZcnwLvP5qW-UuHsgMo",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/10.%20Bad%20Boy%20(Single%20Version).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NzMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQyNTEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.JnycHql_gt1hjG7AsubKpCdwAV0-Q_CqEgS__uE1WRA",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Nelly%20Furtado%20-%20I'm%20Like%20A%20Bird.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1NzMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYxNjAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.aOZSUS152nhsh7ZBg_AdT5hecHjaO2sXZimxCmPoln0",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Plavi%20Orkestar%20-%20Odlazim.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1ODQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU4OTUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.ZqzLUO2wsx4Gvvublxb3R9tx5j1kR2We-mKZrbCeoI0",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/04%20Ti%20vorrei%20rivivere.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1ODQsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ1NjAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.bTF08lCT0DC0YsIIG9k61Ze55_AcbIkkoAKYf9WtP64",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/I%20Don't%20Care%20%20Ariana%20Grande.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1OTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYzNDIsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.rU2ysBl-LKeU6AZBKkfKLaj9vrf82Uz_LB7gV7yKqKo",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/01%20-%20S.O.B.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc1OTMsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIyNDksInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.MnxxnCGbe4KUQYihH1atawLQZin0VSyKlOVB2chvf_0",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/Ljubi%20%20Nevena%20Bo%C5%BEovi%C4%87.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MDUsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzc5NjMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.dUISge2bpTuBdcCTIeemqavH4_jAWGKPt0F_XoM2pQU",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/Shiny%20Happy%20People%20%20R.E.M_.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MDUsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ0NzYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.T9E7n5FP2TMBcRtqRgn_1O1eRnQU67MOVxvYiBtsNLA",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/The%20Love%20Unlimited%20Orchestra%20-%20Love's%20theme.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYyMjUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.kVL9g5O_RyHO7I9AGawz__O3CUUdNRRcn08YHwVnW3c",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Plavi%20Orkestar%20-%20Azra.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODV4OTIsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.JHlJTjqw7sJIfFCd4XP95Nwv0YkXxNcTb-wjDsBiyW8",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/05%20If%20You%20Can't%20Say%20No.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MjcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ1NjYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.5ZUcEE3b3fthj-2q-BSo2gFkiOake2wkkLBr7ESigEU",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/FanGirl%20%208TEEN.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MjcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIwODcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.WMMIu4vmm1feOH-Kc7sFAY9sheiU_7_SLGFcUTbYCqE",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/Maria%20-%20Radio%20Edit%20%20Blondie.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MzgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzI0OTYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.DoPfj7qMpBPranoDSrlTm2U5U76DSjR66_q7xUo5Qy4",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/01%20Ljubi,%20ljubi%20doveka.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2MzgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUxMTEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.C7XsvvhY0X1IjNHjawhLQB52gkPZkqB_jdMvG-98JCw",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/94.%20Norah%20Jones%20-%20Don't%20Know%20Why%20(192kHz-24bit).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NDcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQyOTUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.GoQKgCzKZOIC6ScQpOvKydrGuWVJ3iqJTC-PdROB9-w",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Cobalt%20Blue%20%20Ruby%20Plume.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NDcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMjk4ODUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.GiJ3X7WLrK82LP4siJnZjYqPRpBKtD7D73SDF0CDHFc",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Parni%20Valjak%20-%20Zastave.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU4ODYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.fpboNMk7muvgeF-_npuowkQ0YV9Xb1jMr-3qCeASqcU",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/03%20In%20te.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ1NTMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.wl3W4n6HE3doy5zWiqOVQes8lmTdoODfU8feCFPe-jI",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Bruno%20Mars%20-%20Smokin%20Out%20the%20Window.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYyODUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.IWuFyqGmMmJQgtYfA-sXj2jQ-bUJ5YEAhSvr_hoNIkI",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/Cuts%20Like%20A%20Knife%20(Classic%20Version)%20%20Bryan%20Adams.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzg1NDEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.MeEbk2TmJshfxG0I2ImNTyf8k2NWywj9Ck_36rrPfKo",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/ANTONELA%20DOKO%20-%20IMAMO%20LI%20PROBLEM.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUyMTcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.pHw43xe7AFteTttEN2-mCueTFeJQE_uLvyjgktHX9IY",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/98.%20Primal%20Scream%20-%20Movin'%20on%20Up%20%20(Remastered).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQyOTYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.fwLNu_IcprF5p23FVxgHpJ1m4khuBFs8UjGzpD0Cqvo",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/It%E2%80%99s%20Called%20Doubt%20%20Drayton%20Farley.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2ODcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMDAyOTcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.nGdzPZ93dYxt9Zx_J0FOahZ-4nbVN1M7W7oHKUQAC1k",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/crvena%20jabuka%20-%20deni.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2ODcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU5MzAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.fcLEctMNu07nw6ot7EWE6OehSwCypua0v9cRLGykEpw",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Sins%20Of%20The%20Fathers%20%20UB40.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2OTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMTYzNDksInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.TyP7LywZlHWDLeqad1YcPbQK5RAqp97jVgBl2Oj5Pg8",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Dermot%20Kennedy%20-%20Power%20Over%20Me.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc2OTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYzMTQsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.ArEeL2HgLDpIXVi2wOMjJUhvl_d3-mTXYtzPKzLsGow",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/Double%20Dee%20-%20Found%20Love%20(Caipirina_Remix).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MDgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzI0NDEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.QYfm7apuaZEQ-T08VipyYX2O_c-w7mFilhX1PzJfFG8",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/08.%20Ja%20%C4%86u%20Plakat%20Sama.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MDgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUxNjUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.oNjYpTGfsLqwJWLy_3XAdasB17IYJov3fIEr0pZ3gJk",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/ABBA%20-%20Mamma%20Mia.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MTcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMjkyNDAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.yrhzjPResfUwErURFJjfog8yvG0jenlriclqkqwGMW0",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/Teddy%20Pendergrass%20-%20Love%20T.K.O.%20(Album).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MTcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYyMTgsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.lFhwrtaFhdgpYdbIPX-zhr7V2ZeON40kBAxsV1NJKh4",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/Plavi%20Orkestar%20-%20Ljubi%20se%20istok%20i%20zapad.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MjgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU4OTMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.ygHpegxg0X7Mg0zl0kjSqloy9n4AGHudX1rwpMoPp1U",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Sussudio%20-%202016%20Remaster%20%20Phil%20Collins.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MjgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ4NDUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.QgBosDpvQJ2F7bIRRSKgpbKZhvfdrr_u6DGGoQF9Q-g",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Jay%20Sean%20Feat.%20The%20Rishi%20Rich%20Project%20-%20Eyes%20On%20You%20(feat.%20The%20Rishi%20Rich%20Project).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MzgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYzNjEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.YuiyoB042iivrOYwog1sEmR90kPF67QYdot8qEQ2VIs",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/04%20-%20Time%20After%20Time.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3MzgsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzIzMDEsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.nLUwu47k9xFuraNS2UVBiwJ6mNm8MAVZDp0xuTgRtdM",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/01%20Nedjelja.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NDYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUxMTMsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.RUyx_ZNcwKCp_j8meRPX6iagFdp1HaXcuj53mXdSIx4",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%201/20%20-%20Show%20Me%20Where%20You're%20Coming%20From%20(Edit).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NDYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMjQwNDcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODV9.Xo-TuVewO1hKKxPQO5BIubni1-9feEXkhyPi4aScjb0",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%201/The%20Fray%20-%20How%20to%20Save%20a%20Life.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODYyMjQsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTB9.KkqqPLCLzvIr9tXiWbwwkLk7od8d3o9zLcc7MbcdYY8",
    "https://cdn.bizz-radio.net/Restoran%20Ex-Yu/ITD%20BAND%20-%20Skidam%20Te%20Pogledom.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NTYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODU4MDcsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODl9.C79M6gcgd7zvBRnFH3jzD1z0EkMwTqzZmr2ih3KJ6yg",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%202/Billy%20Idol%20-%20Eyes%20Without%20A%20Face.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODQ2NjYsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODZ9.Es_tyNBN81qEwZW8J36OkBuicBShcZsZh3IfFW-mfXA",
    "https://cdn.bizz-radio.net/Restaurant%20Modern%20Music%202/Mercy%20%20Shawn%20Mendes.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NjYsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODY0MDAsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3OTF9.3q2TQPrPOhMDj-s9Hr6bhwsRE_msRx4gZfLK5rMA1EQ",
    "https://cdn.bizz-radio.net/Restaurant%20Pop-Rock%203/La%20Cumparsita%20%20Julio%20Iglesias.mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoyMzMyMDIsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU4OTB9.6yK9z7sIxEM-G5SP2sXr2JUykMWyz7Cn7CtX-x_XzGs",
    "https://cdn.bizz-radio.net/Restoran%20Doma%C4%87i%20Mix%201/Matija%20Cvek%20-%20Rije%C4%8Di%20(Acoustic%20by%20Pelinova).mp3?stoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzU0OTc3NzcsImlkIjoxNzEsInVzZXJfaWQiOjE3MSwiZGV2aWNlX2lkIjoxMTk2LCJjb250ZW50X2lkIjoxODUzMDUsInR5cGUiOiJjb250ZW50IiwidXNlcl9wbGF5bGlzdF9pZCI6MjU3ODd9.HBf4G4fC5qGudpByuxGkB9tWXjRwQqPdNBedFUdAqrc"
];

// Kreiranje stabla foldera
if (!fs.existsSync(musicFolder)) {
    fs.mkdirSync(musicFolder, { recursive: true });
}

async function downloadFile(url) {
    try {
        // Izvlačenje čistog imena fajla iz URL-a
        const urlWithoutQuery = url.split('?')[0];
        const fileName = path.basename(decodeURIComponent(urlWithoutQuery));
        const filePath = path.join(musicFolder, fileName);

        if (fs.existsSync(filePath)) {
            console.log(`⏩ Preskačem (već postoji): ${fileName}`);
            return fileName;
        }

        console.log(`⏳ Preuzimam: ${fileName}...`);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 30000 // 30 sekundi timeout
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fileName));
            writer.on('error', (err) => {
                fs.unlink(filePath, () => { }); // Briše djelimičan fajl u slučaju greške
                reject(err);
            });
        });
    } catch (error) {
        console.error(`❌ Greška pri preuzimanju: ${error.message}`);
        return null;
    }
}

function parseMetadata(fileName) {
    // Uklanjanje ekstenzije
    let cleanName = fileName.replace(/\.mp3$/i, '');

    // Uklanjanje rednih brojeva na početku (npr. "02 ", "01-")
    cleanName = cleanName.replace(/^\d+[\s\-_]*/, '');

    let artist = "Nepoznat Izvođač";
    let title = cleanName;

    // Ako postoji crtica, razdvoji izvođača i pjesmu
    if (cleanName.includes(' - ')) {
        const parts = cleanName.split(' - ');
        artist = parts[0].trim();
        title = parts[1].trim();
    }

    return { artist, title };
}

async function start() {
    console.log(`🚀 Pokrećem proces za: ${FOLDER_NAME}`);
    const downloadedFiles = [];

    for (const link of rawLinks) {
        const fileName = await downloadFile(link);
        if (fileName) {
            downloadedFiles.push(fileName);
        }
    }

    console.log("📄 Generišem playlist.json...");

    const playlist = downloadedFiles.map((fileName, index) => {
        const { artist, title } = parseMetadata(fileName);
        return {
            id: index + 1,
            title: title,
            artist: artist,
            file_name: fileName,
            url: `./muzika/${fileName}`, // Relativna putanja za plejer
            cover_url: "/images/placeholders/bg-song.png"
        };
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(playlist, null, 2), 'utf-8');
    console.log(`✅ Završeno! Ukupno pjesama: ${playlist.length}`);
    console.log(`📍 Lokacija: ${FOLDER_NAME}/`);
}

start();