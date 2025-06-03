1. Назва застосунку: "RentApartment"
Це вебзастосунок, створений за допомогою Node.js, який дозволяє публікувати та переглядати оголошення про оренду квартир, обмінюватися повідомленнями й оформляти запити на оренду.

 2. Мета
Мета застосунку — спростити процес оренди житла, забезпечити зручний пошук квартир за параметрами та дати змогу орендодавцям ефективно керувати своїми оголошеннями.

 3. Користувачі та їх можливості
Орендар (звичайний користувач):

Перегляд і фільтрація квартир.

Орендодавець:

Додавання/редагування/видалення оголошень.

Додавання опису, умов оренди.


 4. Основні сутності
User
Apartment
CreateForm

 5. Можливості застосунку
Реєстрація та авторизація користувачів.

CRUD-операції з оголошеннями квартир.

Пошук квартир за фільтрами: ціна, кількість кімнат, район.



 6. Вибір технології UI
React.js 

7. Теоретичні питання: 
7.1. Що таке CRUD і як він використовується у JavaScript (Node.js) в проєкті RentApartment?
CRUD — це набір базових операцій над даними:

Create – додавання оголошення про квартиру.

Read – перегляд квартир, фільтрація за містом, ціною тощо.

Update – редагування деталей квартири або інформації користувача.

Delete – видалення оголошення або облікового запису.

Приклад CRUD-операцій у Node.js (Express + MongoDB):
js
Копіювати
Редагувати
// CREATE
app.post('/apartments', async (req, res) => {
  const apartment = new Apartment(req.body);
  await apartment.save();
  res.send(apartment);
});

// READ
app.get('/apartments', async (req, res) => {
  const apartments = await Apartment.find();
  res.send(apartments);
});

// UPDATE
app.put('/apartments/:id', async (req, res) => {
  const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(apartment);
});

// DELETE
app.delete('/apartments/:id', async (req, res) => {
  await Apartment.findByIdAndDelete(req.params.id);
  res.send({ message: 'Apartment deleted' });
});
 7.2. Як правильно визначати сутності та їх взаємозв'язки у RentApartment?
Основні сутності:

User – користувач (орендодавець або орендар).

Apartment – квартира.

BookingRequest – запит на оренду.

Review – відгук на квартиру або користувача.

Message – повідомлення між користувачами.

Схематично у Mongoose:
js
Копіювати
Редагувати
const apartmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  price: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photos: [String],
  availableFrom: Date
});

const bookingRequestSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  dateFrom: Date,
  dateTo: Date
});
Зв’язки:

Один User → багато Apartment.

Один User → багато BookingRequest.

Один Apartment → багато BookingRequest, Review.

Повідомлення (Message) – між двома користувачами.

 7.3. Чому для RentApartment обрано веб-реалізацію (React + Node.js)?
Переваги:

 Універсальність – доступ через браузер із будь-якого пристрою.

 Інтуїтивний інтерфейс – легкий пошук квартир, перегляд фото.

⚙ Можливість розширення – додавання модуля оплати, карти Google, чатів.

 Синхронність – інтерактивна взаємодія між орендарями й орендодавцями.

 7.4. Що таке Git і його роль у проєкті RentApartment?
Git – система контролю версій. Вона дозволяє:

Відстежувати історію змін у коді.

Розробляти нові фічі окремо.

Працювати над проєктом командно.

Відкатуватися до стабільної версії у разі помилки.

🔹 7.5. Основні команди Git, які використовуються у розробці RentApartment
bash
Копіювати
Редагувати
# Створення репозиторію
git init

# Додавання змін
git add .

# Збереження змін
git commit -m "Додано модель Apartment"

# Надсилання змін на GitHub
git push origin main

# Завантаження змін з репозиторію
git pull origin main

# Робота з гілками
git branch feature-booking
git checkout feature-booking
git merge feature-booking
