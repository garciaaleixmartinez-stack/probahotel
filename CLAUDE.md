# PAUta · context per a Claude Code

PAUta és una app web per preparar la selectivitat (PAU 2027) a Espanya, adaptada a cada comunitat autònoma. És un producte que l'Aleix vol llançar a estudiants de 2n de batxillerat i de CFGS.

## Com treballar en aquest projecte

- Llengua de la interfície: **català**. Respon a l'usuari en l'idioma en què t'escrigui.
- Estètica: **Apple** (tipografia del sistema, fons #F5F5F7, targetes blanques arrodonides, títols grans, accent #0066CC). Mantén-la en qualsevol pantalla nova.
- Sense dependències ni frameworks: JavaScript pur, un sol fitxer final.
- Després de cada canvi: `npm run check` (compila i passa les proves). No donis una tasca per acabada si les proves fallen.

## Filtratge de tasques per model

Abans de començar una tasca, classifica-la i delega-la al model que toca (`.claude/agents/`):

| Tipus | Exemples | Qui la fa |
|---|---|---|
| **Senzilla** | buscar al codi, canviar un text o un color, executar `npm run check`, resumir un fitxer | agent `tasques-simples` (Haiku) |
| **Mitjana** | afegir preguntes verificades, actualitzar dates oficials, escriure proves, una pantalla petita | agent `tasques-mitjanes` (Sonnet) |
| **Complexa** | canviar la lògica del pla, redissenyar pantalles, decidir l'arquitectura, errors difícils, revisar la feina dels altres agents | el model principal de la sessió (el més potent) |

- Si una petició barreja tipus, divideix-la i envia cada part on toca.
- Si un agent diu que la tasca era més complexa del previst, fes-la tu.
- Revisa sempre el resultat d'un agent abans de donar la tasca per acabada.

## Estructura

```
src/data.js    Dades: comunitats (dates PAU 2027), matèries i blocs de temari, banc de preguntes, mètode d'estudi
src/plan.js    Generador del pla d'estudi (funcions pures, provades a tests/)
src/app.js     Interfície: onboarding, Inici, Nota, Pla, Scroll, Progrés, Perfil; ratxa; persistència
src/style.css  Estils
build.mjs      Uneix-ho tot a dist/index.html
tests/         Proves amb node (sense dependències)
dist/          Resultat compilat (no l'editis a mà)
```

## Regles de veracitat (molt important)

1. **Dates i regles de la PAU:** només de fonts oficials (comissions organitzadores, universitats, governs autonòmics, BOE). Si una comunitat no ha publicat dates, deixa `status: 'pendent'` i `first: null`; mai no te les inventis. Quan actualitzis dades, canvia `VERIFIED_AT` a `src/data.js`.
2. **Estructura comuna:** Reial Decret 534/2024. La fase d'accés té 4 exàmens, o 5 a les comunitats amb llengua cooficial. Nota d'accés = 60% batxillerat + 40% fase d'accés. Nota d'admissió = accés + a·M1 + b·M2, amb ponderacions de 0,1 o 0,2.
3. **Preguntes del banc** (`BANK`): format `[pregunta, [opcions], índexCorrecte, explicació]`. Afegeix-ne només si la resposta és indiscutible i comprovable. Millor si surten d'exàmens oficials d'anys anteriors.
4. **Temari:** els blocs són orientatius, basats en el currículum estatal (Reial Decret 243/2022). L'app ho diu i remet a l'organisme de cada comunitat.

## Com funciona el pla (src/plan.js)

- **Fases:** fonaments → consolidació (exercicis PAU) → simulacres de 90 minuts amb correcció l'endemà → repàs final de 7 dies sense temari nou.
- **Pràctica intercalada:** mai la mateixa matèria en dos blocs seguits. Repàs espaiat a +1, +7 i +21 dies.
- **Pesos:** fase d'accés 1,0; matèria de modalitat 1,15; matèries d'admissió 0,85. Es multipliquen per com porta l'estudiant cada matèria (×1,45 si li costa, ×1,2 si regular, ×1,0 si bé) i per ×1,15 si té menys d'un 60% d'encerts.
- **Identificadors de sessió:** `AAAA-MM-DD#n`. Són estables mentre no canviïn el perfil ni `planStart`. «Replanifica» fixa `planStart` a avui i parteix dels temes ja fets (`topicsDoneAtStart`).

## Estat i persistència (src/app.js)

- L'objecte `S` es desa a `localStorage` (clau `pauta.v1`). Quan l'app s'obre com a artifact de Claude, també es desa al compte de l'usuari amb la capacitat `db`, al document `data/users/<id>/app`.
- **Ratxa:** un dia compta si s'ha fet una sessió o s'han respost 5 targetes. Els dies de descans de l'horari no trenquen la ratxa. Cada 7 dies seguits es guanya un protector (com a màxim, 2).

## Publicació

L'app publicada viu a l'artifact «PAUta · Prepara la selectivitat» de claude.ai. Per publicar una versió nova, cal pujar-hi `dist/index.html`.
