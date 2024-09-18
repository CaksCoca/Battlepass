// Initialiser un objet pour stocker les quêtes
let quests = {};

// Fonction pour ajouter une quête
function addQuest() {
    // Récupérer les informations de la quête
    const questName = document.getElementById('questName').value;
    if (!questName) {
        alert('Quest Name is required!');
        return;
    }

    const requiresQuest = document.getElementById('requiresQuest').value;
    const description = document.getElementById('description').value;

    // Récupérer les objectifs
    const objectives = [];
    document.querySelectorAll('.objective-entry').forEach((entry) => {
        const objectiveID = parseInt(entry.querySelector('input[name="objectiveID"]').value, 10);
        const objectiveDescription = entry.querySelector('input[name="objectiveDescription"]').value;
        const objectiveType = entry.querySelector('select[name="objectiveType"]').value;
        const objectiveTarget = parseInt(entry.querySelector('input[name="objectiveTarget"]').value, 10);
        const trackBeforeAquired = entry.querySelector('select[name="trackBeforeAquired"]').value === 'true';

        // Traiter les blueprints en ajoutant des virgules et en supprimant les guillemets supplémentaires
        const blueprintsText = entry.querySelector('textarea[name="blueprints"]').value.trim();
        const blueprints = blueprintsText.split('\n').map(bp => bp.replace(/^"|"$/g, '').trim()).filter(bp => bp);

        objectives.push({
            Description: objectiveDescription,
            TrackBeforeAquired: trackBeforeAquired,
            ObjectiveID: objectiveID,
            Type: objectiveType,
            QuestTarget: objectiveTarget,
            Blueprints: blueprints // Tableau formaté correctement
        });
    });

    // Récupérer les récompenses
    const freeReward = {
        RewardDescription: document.getElementById('freeRewardDescription').value,
        RewardIconPath: document.getElementById('freeRewardIconPath').value,
        Commands: document.getElementById('freeRewardCommands').value.trim().split('\n').map(cmd => cmd.trim())
    };

    const premiumReward = {
        RewardDescription: document.getElementById('premiumRewardDescription').value,
        RewardIconPath: document.getElementById('premiumRewardIconPath').value,
        Commands: document.getElementById('premiumRewardCommands').value.trim().split('\n').map(cmd => cmd.trim())
    };

    // Créer un objet pour la quête
    const quest = {
        RequiresQuest: requiresQuest,
        Description: description,
        Objectives: objectives,
        Free: freeReward,
        Premium: premiumReward
    };

    // Ajouter ou remplacer la quête dans l'objet global
    quests[questName] = quest;

    // Ajouter la quête à la liste affichée
    const questList = document.getElementById('questList');
    const listItem = document.createElement('li');
    listItem.textContent = questName;
    questList.appendChild(listItem);

    // Réinitialiser le formulaire pour la prochaine quête
    resetForm();
}

// Fonction pour réinitialiser le formulaire et les objectifs
function resetForm() {
    document.getElementById('questForm').reset();
    document.getElementById('confirmationMessage').textContent = '';

    // Réinitialiser les objectifs existants pour recommencer
    const container = document.getElementById('objectivesContainer');
    container.innerHTML = '<div class="objective-entry"><h4>Objective 1</h4></div>';

    // Réinitialiser les récompenses
    document.getElementById('freeRewardDescription').value = '';
    document.getElementById('freeRewardIconPath').value = '';
    document.getElementById('freeRewardCommands').value = '';

    document.getElementById('premiumRewardDescription').value = '';
    document.getElementById('premiumRewardIconPath').value = '';
    document.getElementById('premiumRewardCommands').value = '';
}

// Fonction pour télécharger le fichier JSON
function downloadJson() {
    // Formatter les blueprints en JSON
    const formattedQuests = {};
    Object.keys(quests).forEach(questName => {
        const quest = quests[questName];
        const formattedQuest = {
            RequiresQuest: quest.RequiresQuest,
            Description: quest.Description,
            Objectives: quest.Objectives.map(obj => ({
                Description: obj.Description,
                TrackBeforeAquired: obj.TrackBeforeAquired,
                ObjectiveID: obj.ObjectiveID,
                Type: obj.Type,
                QuestTarget: obj.QuestTarget,
                Blueprints: obj.Blueprints // Chaque blueprint est déjà sur une ligne séparée
            })),
            Free: {
                RewardDescription: quest.Free.RewardDescription,
                RewardIconPath: quest.Free.RewardIconPath,
                Commands: quest.Free.Commands // Les commandes sont séparées par des virgules
            },
            Premium: {
                RewardDescription: quest.Premium.RewardDescription,
                RewardIconPath: quest.Premium.RewardIconPath,
                Commands: quest.Premium.Commands // Les commandes sont séparées par des virgules
            }
        };
        formattedQuests[questName] = formattedQuest;
    });

    const jsonBlob = new Blob([JSON.stringify(formattedQuests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quests.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Ajouter des écouteurs d'événements
document.getElementById('addQuest').addEventListener('click', addQuest);
document.getElementById('downloadJson').addEventListener('click', downloadJson);

// Fonction pour ajouter un nouvel objectif
document.getElementById('addObjective').addEventListener('click', () => {
    const container = document.getElementById('objectivesContainer');
    const index = container.querySelectorAll('.objective-entry').length + 1;
    const newObjective = `
        <div class="objective-entry">
            <h4>Objective ${index}</h4>
            <label for="objectiveID${index}">Objective ID:</label>
            <input type="number" id="objectiveID${index}" name="objectiveID" required><br>
            <label for="objectiveDescription${index}">Objective Description:</label>
            <input type="text" id="objectiveDescription${index}" name="objectiveDescription" required><br>
            <label for="objectiveType${index}">Objective Type:</label>
            <select id="objectiveType${index}" name="objectiveType" required>
                <option value="craftitem">Craft Item</option>
                <option value="tamedino">Tame Dino</option>
                <option value="killwild">Kill Wild Dino</option>
                <option value="killtamed">Kill Tamed Dino</option>
                <option value="killplayer">Kill Player</option>
                <option value="harvest">Harvest Resources</option>
                <option value="killstructure">Destroy Structure</option>
                <option value="playtime">Play Time</option>
                <option value="claimbaby">Claim Baby Dino</option>
                <option value="killboss">Kill Boss</option>
                <option value="buildstructure">Build Structure</option>
            </select><br>
            <label for="objectiveTarget${index}">Objective Target:</label>
            <input type="number" id="objectiveTarget${index}" name="objectiveTarget" required><br>
            <label for="trackBeforeAquired${index}">Track Before Acquired:</label>
            <select id="trackBeforeAquired${index}" name="trackBeforeAquired">
                <option value="true">True</option>
                <option value="false">False</option>
            </select><br>
            <label for="blueprints${index}">Blueprints (one per line):</label>
            <textarea id="blueprints${index}" name="blueprints" rows="4" placeholder="Enter one blueprint per line"></textarea><br>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', newObjective);
});
