# User Prompts Log

This document records the user prompts provided during the development and iteration of the **Singapore Carpark Live** application.

---

### Prompt 1: Initial Application Build
**Description**: Core application setup for the Singapore Carpark Live app incorporating Jakob Nielsen's 10 Usability Heuristics framework.

```text
Build a real-time Singapore Carpark availability finder web application incorporating Jakob Nielsen's 10 Usability Heuristics framework, featuring:
- Interactive map centered on Singapore with color-coded lot availability pins (Green, Amber, Red).
- Search with auto-suggest for Singapore landmarks, shopping malls, and HDB estates.
- Real-time lot availability and capacity meters for HDB, URA, and commercial carparks.
- Nearby parking lots list with hourly tariffs, grace periods, height clearances, and EV charger counts.
- Parking timer with grace period countdown and estimated fee tracker.
- Dedicated tab detailing Jakob Nielsen's 10 Usability Heuristics and how each is applied in the app.
- Singapore parking guide with EPS gantry mechanics and API connection blueprint.
```

---

### Prompt 2: GitHub Repository Push
**Date**: 2026-09-17

```text
git push http://<GITHUB_PERSONAL_ACCESS_TOKEN>@https://github.com/Happyyybunnyyy/Stephreginaltacarpark.git
```

---

### Prompt 3: Serverless LTA DataMall API Connection
**Date**: 2026-09-17

```text
add a serveless connection to pull data from LTA datamall using the following end point:
-store this in /api(project root level) NOT the /src folder.
-Include /health.ts as well as /carparkavailability.ts within the api folder
Do not hardcode any API key, I will manually include them
#Carpark lots across HDB, LTA and URA (no total lots in this feed):
https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
#Header on every request:
AccountKey: <LTA_ACCOUNT_KEY>
```

---

### Prompt 4: Prompt Collection
**Date**: 2026-09-18

```text
Collect all the prompt I have input and store into prompts.md file
```
