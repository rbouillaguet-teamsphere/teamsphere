# 👨‍💼 Guide Administrateur - TeamSphere

## Vue d'ensemble

En tant qu'**Administrateur**, vous avez tous les droits sur votre club :
- Gérer les membres et leurs rôles
- Créer et gérer les équipes
- Configurer les paramètres du club
- Inviter des coachs et joueurs
- Supprimer le club

## 🏢 Gestion du Club

### Créer un club

1. Connexion à TeamSphere
2. Cliquez sur **"Créer un club"**
3. Remplissez le formulaire :
   - **Nom du club** : Ex. "Rugby Club Giffois"
   - **Sport** : Rugby, Football, Basketball...
   - **Ville** : Ex. "Gif-sur-Yvette"
   - **Description** (optionnel)
4. Cliquez sur **"Créer"**

✅ Vous êtes automatiquement **Admin** du club.

### Modifier les informations du club

1. Sélectionnez votre club
2. Menu **"Paramètres"**
3. Section **"Informations du club"**
4. Modifiez les champs
5. **"Sauvegarder"**

### Supprimer un club

⚠️ **Attention** : Cette action est irréversible !

1. Menu **"Paramètres"**
2. Section **"Zone dangereuse"**
3. **"Supprimer le club"**
4. Confirmez en tapant le nom du club
5. **"Supprimer définitivement"**

## 👥 Gestion des Membres

### Inviter un membre

1. Menu **"Paramètres"** > **"Membres"**
2. Cliquez sur **"Inviter un membre"**
3. Remplissez :
   - **Email** : email@example.com
   - **Rôle** : Admin, Coach, Joueur, Viewer
4. **"Envoyer l'invitation"**

Le membre recevra un email avec un lien d'invitation.

### Rôles disponibles

| Rôle | Permissions |
|------|-------------|
| **Admin** | Tous les droits (gérer club, équipes, membres) |
| **Coach** | Gérer ses équipes, joueurs, matchs |
| **Joueur** | Voir son équipe, son profil, le calendrier |
| **Viewer** | Consultation uniquement (parents, supporters) |

### Modifier le rôle d'un membre

1. Menu **"Paramètres"** > **"Membres"**
2. Trouvez le membre
3. Cliquez sur le menu **"..."**
4. **"Modifier le rôle"**
5. Sélectionnez le nouveau rôle
6. **"Sauvegarder"**

### Retirer un membre

1. Menu **"Paramètres"** > **"Membres"**
2. Trouvez le membre
3. Menu **"..."** > **"Retirer du club"**
4. Confirmez

⚠️ Le membre perdra l'accès à toutes les données du club.

## 🏉 Gestion des Équipes

### Créer une équipe

1. Section **"Équipes"**
2. **"Nouvelle équipe"**
3. Remplissez :
   - **Nom** : Ex. "Seniors"
   - **Catégorie** : Seniors, U18, U16...
   - **Saison** : 2024-2025
4. **"Créer"**

### Assigner un coach à une équipe

1. Cliquez sur l'équipe
2. **"Paramètres de l'équipe"**
3. Section **"Coachs"**
4. **"Ajouter un coach"**
5. Sélectionnez le membre
6. **"Assigner"**

### Transférer un joueur entre équipes

1. Aller sur le joueur
2. **"Éditer"**
3. Changer **"Équipe"**
4. **"Sauvegarder"**

### Archiver une équipe

Pour les équipes des saisons précédentes :

1. Équipe > **"Paramètres"**
2. **"Archiver l'équipe"**
3. Confirmez

L'équipe sera masquée mais les données conservées.

## 📊 Statistiques et Rapports

### Tableau de bord admin

Le dashboard admin affiche :
- 📈 Nombre total de membres
- 🏉 Nombre d'équipes
- 👥 Nombre de joueurs
- 📅 Prochains matchs
- 📊 Statistiques globales

### Exporter les données

1. Menu **"Paramètres"** > **"Export"**
2. Sélectionnez les données :
   - ✅ Membres
   - ✅ Équipes
   - ✅ Joueurs
   - ✅ Matchs
3. Format : CSV ou JSON
4. **"Télécharger"**

## 🔔 Notifications

### Configurer les notifications

1. Menu **"Paramètres"** > **"Notifications"**
2. Activez/Désactivez :
   - ✅ Nouveaux membres
   - ✅ Nouveaux matchs
   - ✅ Résultats de matchs
   - ✅ Présences
3. **"Sauvegarder"**

### Envoyer une annonce

1. Section **"Annonces"**
2. **"Nouvelle annonce"**
3. Rédigez le message
4. Destinataires :
   - Tous les membres
   - Une équipe spécifique
   - Les coachs uniquement
5. **"Publier"**

## 🔒 Sécurité

### Gérer les permissions

1. Menu **"Paramètres"** > **"Permissions"**
2. Configurez :
   - Qui peut créer des équipes ?
   - Qui peut ajouter des joueurs ?
   - Qui peut modifier les matchs ?
3. **"Sauvegarder"**

### Logs d'activité

1. Menu **"Paramètres"** > **"Logs"**
2. Visualisez :
   - Connexions
   - Modifications
   - Suppressions
3. Filtrez par date et membre

## 💡 Bonnes Pratiques

### Organisation du club

1. **Nommer un co-admin** : Pour la redondance
2. **Déléguer aux coachs** : Laisser les coachs gérer leurs équipes
3. **Archiver régulièrement** : Garder un historique propre
4. **Exporter mensuellement** : Sauvegardes de sécurité

### Communication

1. **Annonces importantes** : Utiliser les annonces club-wide
2. **Réunions régulières** : Avec les coachs
3. **Feedback** : Écouter les retours des membres

### Données

1. **Vérifier les doublons** : Joueurs en double
2. **Nettoyer les anciennes données** : Joueurs inactifs
3. **Respecter le RGPD** : Supprimer les données sur demande

## 🆘 Résolution de Problèmes

### Un membre ne reçoit pas l'invitation

1. Vérifier l'email (spam ?)
2. Renvoyer l'invitation
3. Créer un compte manuellement puis l'ajouter

### Un coach ne peut pas accéder à son équipe

1. Vérifier son rôle dans Paramètres > Membres
2. Vérifier qu'il est assigné à l'équipe
3. Lui demander de se déconnecter/reconnecter

### Les données ne se synchronisent pas

1. Vérifier la connexion internet
2. Rafraîchir la page (F5)
3. Vider le cache du navigateur

## 📞 Support

Besoin d'aide ?
- 📧 Email : admin-support@teamsphere.app
- 💬 Chat : Dans l'application (coin inférieur droit)
- 📚 Documentation : [Guides complets](../README.md)