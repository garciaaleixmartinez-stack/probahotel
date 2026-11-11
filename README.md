# PAU-TA

**PAUta** és una app per preparar la selectivitat (PAU 2027), adaptada a cada comunitat autònoma. Inclou onboarding, pla d'estudi automàtic, calculadora de nota, Scroll de targetes, ratxa i progrés.

## Obrir-la amb Claude Code

```bash
cd PAU-TA
claude
```

Claude Code llegirà `CLAUDE.md` i ja sabrà com és el projecte. Alguns exemples del que li pots demanar:

- «Afegeix 10 preguntes verificades de Biologia»
- «Actualitza les dates de la PAU de Madrid»
- «Fes una pantalla de configuració de notificacions»

## Ordres

| Ordre | Què fa |
|---|---|
| `npm run build` | Crea `dist/index.html` |
| `npm test` | Prova el generador del pla i les dades |
| `npm run check` | Fa les dues coses anteriors |
| `npm start` | Compila i obre l'app a http://localhost:3000 |

Només cal tenir **Node.js 18 o superior**; el projecte no té dependències. També pots obrir `dist/index.html` directament amb el navegador. En aquest cas, les dades es desen en aquell navegador.

## Fonts de les dades

- Estructura de la PAU: Reial Decret 534/2024 (BOE)
- Dates de la PAU 2027: comissions i universitats de cada comunitat (verificades l'11/11/2026)
- Temari: blocs orientatius del currículum de batxillerat (Reial Decret 243/2022)
