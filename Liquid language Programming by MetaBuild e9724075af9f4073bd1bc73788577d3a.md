# Liquid language Programming by MetaBuild

Le Liquid Programming Language est un langage de template open-source créé par Shopify. Il est utilisé pour charger du contenu dynamique sur les pages web. Voici un résumé des bonnes pratiques, des cas d'utilisation courants et des exemples :

## Bonnes pratiques :

- Utilisez des noms de variables descriptifs
- Commentez votre code pour une meilleure lisibilité
- Évitez la logique complexe dans les templates
- Utilisez les filtres Liquid pour formater les données
- Organisez votre code en snippets réutilisables

## Cas d'utilisation courants :

- Affichage conditionnel : {% if condition %}...{% endif %}
- Boucles : {% for item in collection %}...{% endfor %}
- Affichage de variables : {{ variable }}
- Filtres : {{ "hello" | capitalize }}

## Exemples :

```
{% if user.name != blank %}
  Hello, {{ user.name }}!
{% else %}
  Hello, Guest!
{% endif %}

{% for product in collection.products %}
  <h2>{{ product.title }}</h2>
  <p>{{ product.price | money }}</p>
{% endfor %}

{{ "now" | date: "%Y-%m-%d" }}
```

## Exercice :

Créez un template Liquid qui affiche une liste de produits avec leur titre et leur prix. Si le prix est supérieur à 50, affichez "Prix élevé" en rouge.

### Solution :

```
<ul>
{% for product in products %}
  <li>
    {{ product.title }} - 
    {% if product.price > 50 %}
      <span style="color: red;">{{ product.price | money }} (Prix élevé)</span>
    {% else %}
      {{ product.price | money }}
    {% endif %}
  </li>
{% endfor %}
</ul>
```

## Cas d'utilisation avancés :

- Pagination : Création de pages numérotées pour les grandes collections
- Localisation : Gestion de contenu multilingue
- Gestion de formulaires : Validation et traitement des entrées utilisateur
- Création de menus dynamiques : Navigation basée sur la structure du site
- Intégration d'API : Récupération et affichage de données externes

### 1. Pagination avec tri et filtrage :

```jsx
{% assign sorted_products = collection.products | sort: 'price' %}
{% assign filtered_products = sorted_products | where: 'type', 'shirt' %}
{% paginate filtered_products by 10 %}
  {% for product in paginate.products %}
    <div class="product">
      <h3>{{ product.title }}</h3>
      <p>{{ product.price | money }}</p>
    </div>
  {% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

### 2. Localisation avec détection de langue :

```jsx
{% assign current_language = 'fr' %}
{% case current_language %}
  {% when 'en' %}
    {% assign welcome_message = 'Welcome' %}
  {% when 'fr' %}
    {% assign welcome_message = 'Bienvenue' %}
  {% else %}
    {% assign welcome_message = 'Hello' %}
{% endcase %}

<h1>{{ welcome_message }}, {{ customer.name }}!</h1>

{% assign translated_products = products | map: current_language %}
{% for product in translated_products %}
  <h2>{{ product.title }}</h2>
  <p>{{ product.description }}</p>
{% endfor %}
```

### 3. Gestion de formulaire avec validation :

```jsx
{% form 'contact' %}
  {% if form.errors %}
    <div class="error-message">
      {% for error in form.errors %}
        <p>{{ error | capitalize }}: {{ form.errors.messages[error] }}</p>
      {% endfor %}
    </div>
  {% endif %}

  <label for="name">Nom:</label>
  <input type="text" id="name" name="contact[name]" value="{{ form.name }}" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="contact[email]" value="{{ form.email }}" required>

  <label for="message">Message:</label>
  <textarea id="message" name="contact[message]" required>{{ form.message }}</textarea>

  <button type="submit">Envoyer</button>
{% endform %}
```

### 4. Menu dynamique basé sur la structure du site :

```jsx
{% assign main_menu = linklists.main-menu %}
<nav>
  <ul>
    {% for link in main_menu.links %}
      {% assign child_list_handle = link.handle | append: '-child' %}
      {% assign child_list = linklists[child_list_handle] %}
      <li{% if link.active or child_list.active_link %} class="active"{% endif %}>
        <a href="{{ link.url }}">{{ link.title }}</a>
        {% if child_list.links.size > 0 %}
          <ul>
            {% for child_link in child_list.links %}
              <li{% if child_link.active %} class="active"{% endif %}>
                <a href="{{ child_link.url }}">{{ child_link.title }}</a>
              </li>
            {% endfor %}
          </ul>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</nav>
```

### 5. Intégration d'API et mise en cache :

```jsx
{% capture weather_cache %}{% endcapture %}
{% if weather_cache == empty %}
  {% assign weather_data = shop.metafields.weather_api.current_weather | default: '{}' | json_parse %}
  {% if weather_data == empty or weather_data.timestamp < 'now' minus 1 hour %}
    {% assign api_url = 'https://api.weather.com/current?city=Paris' %}
    {% assign weather_response = api_url | get_api_response %}
    {% assign weather_data = weather_response | json_parse %}
    {% assign weather_cache = weather_data | json %}
    {% assign expiry_time = 'now' | date: '%s' | plus: 3600 | date: '%Y-%m-%d %H:%M:%S' %}
    {% capture weather_cache %}
      {"data": {{ weather_cache }}, "expiry": "{{ expiry_time }}"}
    {% endcapture %}
    {% assign _ = shop.metafields.weather_api.current_weather | update: weather_cache %}
  {% endif %}
{% endif %}

{% assign weather = weather_cache.data %}
<div class="weather-widget">
  <h3>Météo à Paris</h3>
  <p>Température: {{ weather.temperature }}°C</p>
  <p>Conditions: {{ weather.conditions }}</p>
</div>
```

### 6. Génération de balises méta dynamiques :

```jsx
{% assign product_title = product.title | escape %}
{% assign product_description = product.description | strip_html | truncate: 160 %}
{% assign product_image = product.featured_image | img_url: 'medium' %}

<meta name="title" content="{{ product_title }}">
<meta name="description" content="{{ product_description }}">
<meta property="og:image" content="{{ product_image }}">

```

### 7. Système de commentaires avec modération :

```jsx
{% for comment in comments %}
  <div class="comment">
    <p><strong>{{ comment.author }}</strong> - {{ comment.date | date: "%B %d, %Y" }}</p>
    <p>{{ comment.content }}</p>
    {% if comment.approved %}
      <span class="status approved">Approved</span>
    {% else %}
      <span class="status pending">Pending Approval</span>
    {% endif %}
  </div>
{% endfor %}

```

### 8. Calcul de prix avec remises :

```jsx
{% assign original_price = product.price %}
{% assign discount = product.discount | default: 0 %}
{% assign discounted_price = original_price | minus: discount %}

<p>Prix original: {{ original_price | money }}</p>
{% if discount > 0 %}
  <p>Remise: {{ discount | money }}</p>
  <p>Prix après remise: {{ discounted_price | money }}</p>
{% else %}
  <p>Aucune remise appliquée</p>
{% endif %}

```

### 9. Affichage d'un compte à rebours pour les offres :

```jsx
{% assign end_time = '2023-12-31 23:59:59' | date: "%s" %}
{% assign current_time = 'now' | date: "%s" %}
{% assign time_left = end_time | minus: current_time %}

{% if time_left > 0 %}
  <div class="countdown">
    <p>Temps restant pour l'offre : {{ time_left | date: "%-H heures, %-M minutes, %-S secondes" }}</p>
  </div>
{% else %}
  <p>L'offre est terminée.</p>
{% endif %}

```

### 10. Intégration de commentaires d'utilisateurs avec pagination :

```jsx
{% paginate comments by 5 %}
  {% for comment in paginate.comments %}
    <div class="user-comment">
      <h4>{{ comment.user_name }}</h4>
      <p>{{ comment.text }}</p>
    </div>
  {% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}

```

### 11. Gestion des utilisateurs avec rôles

Dans cet exemple, on montre comment gérer les utilisateurs avec différents rôles et afficher le contenu en fonction de leur rôle.

```jsx
{% assign user_role = customer.tags | first %}

{% case user_role %}
  {% when 'admin' %}
    <p>Bienvenue, administrateur. Vous avez accès à toutes les fonctionnalités.</p>
  {% when 'editor' %}
    <p>Bienvenue, éditeur. Vous pouvez modifier le contenu.</p>
  {% else %}
    <p>Bienvenue, utilisateur. Vous avez un accès limité.</p>
{% endcase %}

```

### 12. Intégration avec un système de gestion de contenu (CMS)

Cet exemple montre comment intégrer du contenu provenant d'un CMS externe pour afficher des articles de blog ou des pages de contenu.

```jsx
{% assign articles = cms_api.articles | limit: 5 %}

{% for article in articles %}
  <h2>{{ article.title }}</h2>
  <p>{{ article.summary }}</p>
  <a href="{{ article.url }}">Lire la suite</a>
{% endfor %}

```

### 13. Personnalisation de l'expérience utilisateur

En utilisant les données utilisateur, cet exemple montre comment personnaliser le contenu affiché pour chaque utilisateur.

```jsx
{% assign user_preferences = customer.metafields.preferences %}

{% if user_preferences.show_recommendations %}
  <h3>Produits recommandés pour vous :</h3>
  {% for product in user_recommendations %}
    <h4>{{ product.title }}</h4>
    <p>{{ product.price | money }}</p>
  {% endfor %}
{% endif %}

```

### 14. Filtrage avancé de produits

Voici un exemple de filtrage avancé permettant aux utilisateurs de trouver des produits en fonction de plusieurs critères.

```jsx
{% assign filtered_products = products | where: 'price', '>', 20 | where: 'category', 'electronics' %}

{% for product in filtered_products %}
  <h2>{{ product.title }}</h2>
  <p>{{ product.price | money }}</p>
{% endfor %}

```

### 15. Synchronisation avec des événements en temps réel

Cet exemple montre comment afficher des événements ou des notifications en temps réel sur une page.

```jsx
{% assign events = api.events | where: 'is_live', true %}

{% for event in events %}
  <div class="live-event">
    <h3>{{ event.title }}</h3>
    <p>Commence à : {{ event.start_time | date: "%H:%M" }}</p>
  </div>
{% endfor %}

```

### 16. Gestion de l'inventaire avec alertes de stock

Ce code montre comment gérer l'inventaire et générer des alertes lorsque le stock est bas.

```jsx
{% for product in products %}
  <h2>{{ product.title }}</h2>
  <p>Stock : {{ product.inventory_count }}</p>
  {% if product.inventory_count < 5 %}
    <p style="color: red;">Stock faible ! Commandez bientôt.</p>
  {% endif %}
{% endfor %}

```

### 17. Génération de rapports dynamiques

Exemple de génération de rapports basés sur les données de vente ou d'utilisateur.

```jsx
{% assign total_sales = sales | sum: 'amount' %}
<p>Chiffre d'affaires total : {{ total_sales | money }}</p>

{% assign sales_by_category = sales | group_by: 'category' %}
{% for category, sales in sales_by_category %}
  <h3>{{ category }}</h3>
  <p>Total : {{ sales | sum: 'amount' | money }}</p>
{% endfor %}

```

### 18. Automatisation des tâches administratives

Exemple d'automatisation de tâches répétitives comme l'envoi d'e-mails ou la mise à jour de données.

```jsx
{% if order.status == 'shipped' %}
  <p>Votre commande a été expédiée.</p>
  {% assign _ = email_api.send_notification(order.customer_email, 'Votre commande a été expédiée') %}
{% endif %}

```

### 19. Création de tableaux de bord interactifs

Voici comment créer un tableau de bord interactif pour afficher des métriques clés.

```jsx
{% assign metrics = dashboard_api.get_metrics %}

<div class="dashboard">
  <h2>Tableau de bord des performances</h2>
  <p>Utilisateurs actifs : {{ metrics.active_users }}</p>
  <p>Ventes totales : {{ metrics.total_sales | money }}</p>
  <p>Produits en stock : {{ metrics.stock_level }}</p>
</div>

```

### 20. Mise en œuvre de tests A/B

Exemple de mise en œuvre de tests A/B pour optimiser le contenu des pages.

```jsx
{% assign test_group = customer.id | modulo: 2 %}
{% if test_group == 0 %}
  <p>Version A : Bienvenue sur notre site !</p>
{% else %}
  <p>Version B : Découvrez nos offres spéciales !</p>
{% endif %}

```

### 21. Gestion des promotions saisonnières

Exemple de mise en œuvre de promotions saisonnières avec des réductions spécifiques.

```jsx
{% assign current_month = 'now' | date: "%m" %}
{% case current_month %}
  {% when '12' %}
    {% assign discount = 20 %}
  {% when '01' %}
    {% assign discount = 15 %}
  {% else %}
    {% assign discount = 10 %}
{% endcase %}

<p>Réduction actuelle : {{ discount }}%</p>

```

### 22. Intégration de chat en direct

Implémentation d'une fonctionnalité de chat en direct sur le site.

```jsx
{% if customer.logged_in %}
  <div id="chat-widget">
    <h4>Chattez avec nous !</h4>
    <button onclick="openChat()">Commencer le chat</button>
  </div>
{% endif %}

```

### 23. Analyse comportementale utilisateur

Collecte de données sur les interactions utilisateur pour l'analyse comportementale.

```jsx
{% assign user_interactions = customer.metafields.interactions | append: 'page_view' %}
{% assign _ = customer.metafields.interactions | update: user_interactions %}

```

### 24. Affichage dynamique des témoignages

Présentation de témoignages de clients de manière dynamique.

```jsx
{% for testimonial in testimonials | sample: 3 %}
  <blockquote>
    <p>"{{ testimonial.quote }}"</p>
    <footer>— {{ testimonial.author }}</footer>
  </blockquote>
{% endfor %}

```

### 25. Gestion des réservations en temps réel

Système de gestion des réservations avec mises à jour en temps réel.

```jsx
{% if reservation.available %}
  <button onclick="reserveSpot()">Réserver maintenant</button>
{% else %}
  <p>Aucune place disponible actuellement.</p>
{% endif %}

```

### 26. Personnalisation de la page d'accueil

Adaptez le contenu de la page d'accueil en fonction des préférences utilisateur.

```jsx
{% if customer.tags contains 'vip' %}
  <h2>Bienvenue, client VIP !</h2>
{% else %}
  <h2>Bienvenue sur notre site !</h2>
{% endif %}

```

### 27. Affichage de la disponibilité des produits

Indiquez la disponibilité des produits en fonction de la localisation de l'utilisateur.

```jsx
{% assign location = customer.address.country %}
{% if location == 'France' %}
  <p>Produit disponible en France.</p>
{% else %}
  <p>Produit non disponible dans votre région.</p>
{% endif %}

```

### 28. Gestion des abonnements

Mécanisme de gestion des abonnements avec options de renouvellement.

```jsx
{% if customer.subscribed %}
  <p>Votre abonnement se renouvelle le {{ customer.subscription.renewal_date | date: "%d %B %Y" }}.</p>
{% else %}
  <button onclick="subscribe()">S'abonner</button>
{% endif %}

```

### 29. Suivi des campagnes marketing

Suivi des campagnes marketing et affichage des résultats.

```jsx
{% assign campaign_results = marketing_api.campaign_results %}
{% for result in campaign_results %}
  <h3>{{ result.campaign_name }}</h3>
  <p>Conversions : {{ result.conversions }}</p>
{% endfor %}

```

### 30. Intégration de systèmes de paiement alternatifs

Ajout de méthodes de paiement alternatives pour les clients.

```jsx
{% if payment_methods.contains 'crypto' %}
  <button onclick="payWithCrypto()">Payer avec Crypto</button>
{% else %}
  <button onclick="payWithCard()">Payer avec Carte</button>
{% endif %}

```

###