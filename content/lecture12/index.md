---
type: lecture
index: 12
template: page
make_docx: true
print_pdf: true
---

<div dir="rtl" class="site-style">

# הרצאה 12 - PCA and K-Means

<div dir="ltr">
<a href="./slides/" class="link-button" target="_blank">Slides</a>
<a href="/assets/lecture12.pdf" class="link-button" target="_blank">PDF</a>
<a href="./code/" class="link-button" target="_blank">Code</a>
</div>

## מה נלמד היום

<div class="imgbox" style="max-width:900px">

![](./assets/course_diagram.png)

</div>

## למידה לא מודרכת (Unsupervised Learning)

Unsupervised learning הינה שם כולל למגוון של בעיות בהם אנו מנסים בהינתן מדגם, ללמוד את התכונות של הדגימות או של המדגם כולו. בניגוד ל supervised learning, ב unsupervised learning המדגם יכיל רק אוסף של דגימות ($\boldsymbol{x}$), ללא תווית ($y$). להלן דוגמאות לכמה בעיות ב unsupervised learning:

- אשכול (חלוקה לקבוצות).
- מציאת ייצוג "נוח" יותר של הדגימות.
- דחיסה.
- זיהוי אנומליות.
- למידת הפילוג של הדגימות.

כפי שציינו בעבר, בקורס זה לא נציג את הנושא של unsupervised learning באופן מקיף אלא רק נלמד על שני אלגוריתמים פופולריים מתחום זה, PCA ו K-Means.

## מערכת Encoder-Decoder

תצורה נפוצה של מערכות שמטפלות במידע הינה:

<div class="imgbox" style="max-width:700px">

![](./assets/encoder_decoder.png)

</div>

במערכת מסוג זה נרצה להשתמש בפונקציית ה encoder על מנת למפות את הוקטור $\boldsymbol{x}$ לייצוג אלטרנטיבי $\boldsymbol{z}$ אשר יהיה מתאים יותר לשימושים כל שהם. בכדי לנסות שחזר את $\boldsymbol{x}$ נוכל להעביר את $\boldsymbol{z}$ דרך ה decoder.

דוגמאות לשימושים במערכת encoder-decoder הינם:

- דחיסה: כאן נרצה ש $\boldsymbol{z}$ יהיה קטן ככל האפשר (במובן של כמות הביט שנדרשים בכדי לייצג אותו).
- תקשורת: כאן נרצה ש $\boldsymbol{z}$ יהיה כמה שפחות רגיש לרעשים של התווך.
- הצפנה: כאן נרצה שפעולת השחזור של $\boldsymbol{x}$ תהיה כמה שיותר קשה ללא ה decoder המתאים.

הוקטור $\tilde{\boldsymbol{x}}$ המתקבל מהפעלה של ה decoder על הוקטור $\boldsymbol{z}$ נקרא השחזור של $\boldsymbol{x}$. בחלק מהמערכות ניתן להגיע לשיחזור מושלם, $\tilde{\boldsymbol{x}}=\boldsymbol{x}$, ובחלק מהמערכות לא.

## Principle Component Analysis (PCA)

ב PCA ננסה לבנות מערכת encoder-decoder שבה:

1. אנו מגבילים את האורך של הוקטור $\boldsymbol{z}$.
2. אנו דורשים שה encoder וה decoder יהיו פונקציות אפיניות (affine = linear + offset).
3. התוחלת של שגיאת השחזור הריבועית $\mathbb{E}\left[\lVert\tilde{\mathbf{x}}-\mathbf{x}\rVert_2^2\right]$ היא מינימאלית.

מכיוון שהפילוג של $\mathbf{x}$ לרוב לא יהיה ידוע נשתמש במדגם ונחליף את התוחלת בתוחלת אמפירית על המדגם.

נסמן את האורך של הוקטור $\boldsymbol{z}$ שאותו אנו מעוניינים לייצר ב $K$ ואת האורך של $\boldsymbol{x}$ ב $D$ ונגדיר את הבעיה באופן יותר פורמאלי. אנו מעוניינים למצוא encoder מהצורה:

$$
\boldsymbol{z}=T_1\boldsymbol{x}+\boldsymbol{b}_1
$$

ו decoder מהצורה של:

$$
\tilde{\boldsymbol{x}}=T_2\boldsymbol{z}+\boldsymbol{b}_2
$$

כאשר:

- $T_1$ הינה מטריצה בגודל $K\times D$.
- $T_2$ הינה מטריצה בגודל $D\times K$.
- $\boldsymbol{b}_1$ הינה וקטור באורך $K$.
- $\boldsymbol{b}_2$ הינה וקטור באורך $D$.

אשר ממזערים את התוחלת האמפירית של שגיאת השחזור הריבועית:

$$
\underset{T_1,T_2,\boldsymbol{b}_1,\boldsymbol{b}_2}{\arg\min}
\frac{1}{N}\sum_{i=1}^N\lVert\tilde{\boldsymbol{x}}^{(i)}-\boldsymbol{x}^{(i)}\rVert_2^2
$$

### שימושים

ישנם מקרים רבים בהם נרצה למצוא לוקטורים יצוג ממימד נמוך. פעולה זו מכונה **הורדת מימד (dimensionality reduction)** ודוגמאות למקומות שבהם נרצה להשתמש בפעולה זו הינם:

1. בחירת מאפיינים לבעיות supervised learning - בהם נרצה להשתמש בוקטורים ממימד נמוך יותר על מנת להקטין את ה overfitting.
2. ויזואליזציה - בהם נרצה להפוץ וקטורים ממימד גבוה למימד 2 או 3 שאותם אנו יודעים לשרטט.
3. דחיסה.

## הפתרון לבעיית האופטימיזציה

נתחיל בלהציג את הפתרון לבעיה.

#### הפשטת הבעיה תוך ביטול היתירות

מסתבר שלבעיה זו ישנם מספר רב של פתרונות. בתהליך פיתוח הפתרון ניתן להראות שניתן לבחור את הפרמטרים כך שיקיימו את האילוצים הבאים מבלי לפגוע באופטימאליות של הפתרון:

$$
\begin{aligned}
\boldsymbol{b}_1&=-T_1\boldsymbol{\mu}\\
\boldsymbol{b}_2&=\boldsymbol{\mu}\\
T_1&=T_2^{\top}=T^{\top}\\
T^{\top}T&=I
\end{aligned}
$$

כאשר $\boldsymbol{\mu}=\frac{1}{N}\sum_{i=1}^N\boldsymbol{x}^{(i)}$. הטרנספורמציות במקרה זה הופכות להיות:

$$
\begin{aligned}
\boldsymbol{z}&=T^{\top}(\boldsymbol{x}-\boldsymbol{\mu})\\
\tilde{\boldsymbol{x}}&=T\boldsymbol{z}+\boldsymbol{\mu}
\end{aligned}
$$

ובעיית האופטימיזציה הינה:

$$
\begin{aligned}
T^*=\underset{T}{\arg\min}\quad&\frac{1}{N}\sum_{i=1}^N\lVert\tilde{\boldsymbol{x}}^{(i)}-\boldsymbol{x}^{(i)}\rVert_2^2\\
\text{s.t.}\quad& T^{\top}T=I\\
T^*=\underset{T}{\arg\min}\quad&\frac{1}{N}\sum_{i=1}^N\lVert(TT^{\top}-I)(\boldsymbol{x}^{(i)}-\boldsymbol{\mu})\rVert_2^2\\
\text{s.t.}\quad& T^{\top}T=I
\end{aligned}
$$

#### פרשנות גיאומטרית

ראשית נשים לב שה encoder מתחיל בלחסר את הממוצע של $\boldsymbol{x}$ וה decoder מסיים בלהוסיף אותו בחזרה. לשם הנוחות נסתכל על הגרסא של $\boldsymbol{x}$ מחוסרת הממוצע: $\boldsymbol{x}'=\boldsymbol{x}-\boldsymbol{\mu}$.

נדגים זאת בעבור המקרה של $D=2$ ו $K=1$:

<div class="imgbox" style="max-width:700px">

![](./assets/pca_remove_mean.png)

</div>

הטרנספורמציות המתקבלות הינן:

$$
\begin{aligned}
\boldsymbol{z}&=T^{\top}\boldsymbol{x}'\\
\tilde{\boldsymbol{x}}'&=T\boldsymbol{z}=TT^{\top}\boldsymbol{x}'
\end{aligned}
$$

נתייחס כעת לאילוץ של $T^{\top}T=I$. נציין רק שאילוץ זה הוא לא הכרחי בשביל שהפתרון יהיה אופטימאלי אך הוא לא מפשט מאד את הבעיה ומקיים ולא פוגע באופטימאליות של הפתרון. אילוץ זה אומר שהעמודות של $T$ צריכות להיות אורתונורמאליות (אורתוגונאליות ומנורמלות). נסמן את העמודות של $T$ ב $\boldsymbol{u}_j$:

$$
T=\begin{pmatrix}
  | & |  &  & | \\
  \boldsymbol{u}_1 & \boldsymbol{u}_2 & \dots & \boldsymbol{u}_K \\
  | & |  &  & |
\end{pmatrix}
$$

הפעולה של $\tilde{\boldsymbol{x}}'=TT^{\top}\boldsymbol{x}'$ מטילה את הוקטור $\boldsymbol{x}'$ על התת-מרחב הלינארי הנפרס על ידי הוקטורים $\boldsymbol{u}_j$. נדגים זאת על המקרה הקודם:

<div class="imgbox" style="max-width:700px">

![](./assets/pca_project.png)

</div>

הפעולה של $\boldsymbol{z}=T^{\top}\boldsymbol{x}'$ למעשה גם כן מטילה את $\boldsymbol{x}'$ על אותו תת-מרחב, היא רק משאירה אותו במערכת הצירים אשר מוגדרת על ידי הוקטורים $\boldsymbol{u}_j$:

<div class="imgbox" style="max-width:700px">

![](./assets/pca_transform.png)

</div>

נסתכל כעת על המשמעות הגיאומטרית של שגיאת השחזור $\lVert\tilde{\boldsymbol{x}}-\boldsymbol{x}\rVert_2^2$:

<div class="imgbox" style="max-width:500px">

![](./assets/pca_recon_error.png)

</div>

הוקטור $\tilde{\boldsymbol{x}}-\boldsymbol{x}$ הוא וקטור המחבר את $\boldsymbol{x}$ ל $\tilde{\boldsymbol{x}}$. שגיאת השחזור הריבועית הינה האורך של וקטור זה בריבוע. בעיית האופטימיזציה היא אם כן הבעיה של מציאת תת-המרחב ממימד $K$ אשר ההטלה של נקודות המדגם עליו הם הקרובות ביותר לנקודות המקוריות.

#### הבעיה השקולה

מתוך העובדה ש $T^{\top}T=I$ ניתן להראות ש:

$$
\lVert\tilde{\boldsymbol{x}}-\boldsymbol{x}\rVert_2^2
=\lVert\boldsymbol{x}\rVert_2^2-\lVert\tilde{\boldsymbol{x}}\rVert_2^2
=\lVert\boldsymbol{x}\rVert_2^2-\lVert\boldsymbol{z}\rVert_2^2
$$

מכאן שנוכל לרשום את בעיית האופטימיזציה באופן הבא:

$$
\begin{aligned}
T^*=\underset{T}{\arg\min}\quad&\frac{1}{N}\sum_{i=1}^N\left( \lVert\boldsymbol{x}^{(i)}\rVert_2^2
                                                             -\lVert\boldsymbol{z}^{(i)}\rVert_2^2
                                                             \right)\\
\text{s.t.}\quad& T^{\top}T=I
\end{aligned}
$$

נזכור ש $\lVert\boldsymbol{x}\rVert_2^2$ והוא תכונה של הוקטורים במדגם; הם אינם תלויים ב $T$ ולכן:

$$
\begin{aligned}
T^*=\underset{T}{\arg\min}\quad&-\frac{1}{N}\sum_{i=1}^N\lVert\boldsymbol{z}^{(i)}\rVert_2^2\\
\text{s.t.}\quad& T^{\top}T=I
\end{aligned}
$$

לכן הבעיה של מזעור שגיאת השחזור הריבועית שקולה לבעיה של מקסום הגודל $\sum_{i=1}^N\lVert\boldsymbol{z}^{(i)}\rVert_2^2$ אשר מכונה לרוב ה variance של אוסף הוקטורים $\{\boldsymbol{z}^{(i)}\}_{i=1}^N$ (בפועל זה ה trace של מטריצת ה covariance האמפירית של $\mathbf{z}$)

### הפתרון

בכדי לתאר את הפתרון של בעיות האופטימיזציות האלה (מזעור שגיאת השחזור או מקסום ה variance של $\boldsymbol{z}$) נגדיר את המטריצות הבאות:

מטריצת המדידות $X$:

$$
X
=\begin{pmatrix}
  - & \boldsymbol{x}'^{(1)} & -\\
  - & \boldsymbol{x}'^{(2)} & -\\
    & \vdots &  \\
  - & \boldsymbol{x}'^{(N)} & -\\
\end{pmatrix}
=\begin{pmatrix}
  - & (\boldsymbol{x}^{(1)}-\boldsymbol{\mu})^{\top} & -\\
  - & (\boldsymbol{x}^{(2)}-\boldsymbol{\mu})^{\top} & -\\
    & \vdots &  \\
  - & (\boldsymbol{x}^{(N)}-\boldsymbol{\mu})^{\top} & -\\
\end{pmatrix}
$$

מטריצת ה covariance האמפירית של $\mathbf{x}$ תהיה: $P=X^{\top}X$.

מכיוון ש המטריצה $P$ היא ממשית וסימטרית מובטח כי ניתן לפרק אותה באופן הבא (ליכסון של המטריצה) $P=U\Lambda U^{\top}$ כאשר $U$ היא מטריצה אורתונורמלית אשר העמודות שלה הם וקטורים עצמיים של $P$:

$$
U=\begin{pmatrix}
  | & |  &  & | \\
  \boldsymbol{u}_1 & \boldsymbol{u}_2 & \dots & \boldsymbol{u}_3 \\
  | & |  &  & |
\end{pmatrix}
$$

ו $\Lambda$ היא מטריצה אלכסונית אשר מכילה את הערכים העצמיים של $P$:

$$
\Lambda=\begin{pmatrix}
  \lambda_1 & 0 & \dots & 0 \\
  0 & \lambda_2 & & 0 \\
  \vdots & & \ddots & \vdots \\
  0 & 0 & \dots & \lambda_D \\
\end{pmatrix}
$$

כך שהערך העצמי $\lambda_j$ מתאים לוקטור העצמי $\boldsymbol{u}_j$ והערכים העצמיים מסודרים מהגדול לקטן: $\lambda_1\geq\lambda_2\geq\dots\geq\lambda_D$.

בעזרת מטריצות אלו ניתן כעת לרשום את הפתרון למטריצה $T$ האופטימאלית. מטריצה זו תהיה מטריצה אשר העמודות שלה הם $K$ העמודות הראשונות במטריצה $U$:

$$
T=\begin{pmatrix}
  | & |  &  & | \\
  \boldsymbol{u}_1 & \boldsymbol{u}_2 & \dots & \boldsymbol{u}_K \\
  | & |  &  & |
\end{pmatrix}
$$

הכיוונים $\boldsymbol{u}^{(j)}$ מכונים ה**כיוונים העיקריים** והרכיבים של הוקטור $\boldsymbol{z}$ מכונים ה**רכיבים העיקריים (principal components)**.

### קווים כלליים לפתרון

נציג את הרעיון הכללי לפתרון הבעיה בלי הפיתוחים המתימטיים מלאים.

#### חישוב ה offsets

ראשית ניתן למצוא תנאי על $\boldsymbol{b}_1$ ו $\boldsymbol{b}_2$ על יד גזירה והשוואה ל-0. תנאי זה הינו:

$$
T_2\boldsymbol{b}_1+\boldsymbol{b}_2=-T_2T_1\boldsymbol{\mu}+\boldsymbol{\mu}
$$

כאשר $\boldsymbol{\mu}=\frac{1}{N}\sum_{i=1}^N\boldsymbol{x}^{(i)}$. כאשר כל בחירה של $\boldsymbol{b}_1$ ו $\boldsymbol{b}_2$ שמקיימת את התנאי תהיה אופטימאלית. בפרט נוכל לבחור:

$$
\boldsymbol{b}_1=-T_1\boldsymbol{\mu}
,\qquad
\boldsymbol{b}_2=\boldsymbol{\mu}
$$

ומכאן אנו מקבלית את הטרנספורמציות של:

$$
\begin{aligned}
\boldsymbol{z}=T_1(\boldsymbol{x}-\boldsymbol{\mu})\\
\tilde{\boldsymbol{x}}=T_2\boldsymbol{z}+\boldsymbol{\mu}
\end{aligned}
$$

#### הקשר בין $T_1$ ו $T_2$

על ידי קיבוע $T_2$ וחיפוש ה $\boldsymbol{z}$ אשר ממזער את בעיית האופטימיזציה מקבלים ש:

$$
T_1=(T_2^{\top}T_2)^{-1}T_2^{\top}
$$

בפרט ניתן להראות שניתן לבחור את $T_2$ כך ש $T_2^{\top}T_2=I$. נסמן את $T_2=T$ ונקבל ש:

$$
\begin{aligned}
\boldsymbol{z}=T^{\top}\boldsymbol{x}'\\
\tilde{\boldsymbol{x}}'=T\boldsymbol{z}=TT^{\top}\boldsymbol{x}'
\end{aligned}
$$

#### הפירוק של שגיאת החיזוי

את שגיאת החיזוי הריבועית ניתן לפרק באופן הבא:

$$
\begin{aligned}
\lVert\tilde{\boldsymbol{x}}-\boldsymbol{x}\rVert_2^2
&=\lVert TT^{\top}\boldsymbol{x}-\boldsymbol{x}\rVert_2^2\\
&=\lVert(TT^{\top}-I)\boldsymbol{x}\rVert_2^2\\
&=\boldsymbol{x}^{\top}(TT^{\top}-I)^{\top}(TT^{\top}-I)\boldsymbol{x}\\
&=  \boldsymbol{x}^{\top}T\underbrace{
            T^{\top}T
       }_{=I}T^{\top}\boldsymbol{x}
  -2\boldsymbol{x}^{\top}TT^{\top}\boldsymbol{x}
  +\boldsymbol{x}^{\top}\boldsymbol{x}\\
&= \boldsymbol{x}^{\top}\boldsymbol{x}
  -\boldsymbol{x}^{\top}TT^{\top}\boldsymbol{x}\\
&= \boldsymbol{x}^{\top}\boldsymbol{x}
  -\boldsymbol{z}^{\top}\boldsymbol{z}\\
&= \lVert\boldsymbol{x}\rVert_2^2
  -\lVert\boldsymbol{z}\rVert_2^2
\end{aligned}
$$

#### מציאת ה $T$ האופטימאלי

נסתכל על בעיית האופטימיזציה השקולה:

$$
\begin{aligned}
T^*=\underset{T}{\arg\min}\quad&-\frac{1}{N}\sum_{i=1}^N\lVert\boldsymbol{z}^{(i)}\rVert_2^2\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\frac{1}{N}\sum_{i=1}^N\lVert T^{\top}\boldsymbol{x}'^{(i)}\rVert_2^2\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\frac{1}{N}\sum_{i=1}^N\boldsymbol{x}'^{(i)\top}TT^{\top}\boldsymbol{x}'^{(i)}\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\frac{1}{N}\sum_{i=1}^N\text{tr}\left(\boldsymbol{x}'^{(i)\top}TT^{\top}\boldsymbol{x}'^{(i)}\right)\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\text{tr}\left(\left(\frac{1}{N}\sum_{i=1}^N\boldsymbol{x}'^{(i)}\boldsymbol{x}'^{(i)\top}\right)TT^{\top}\right)\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\text{tr}\left(X^{\top}XTT^{\top}\right)\\
\text{s.t.}\quad& T^{\top}T=I\\
=\underset{T}{\arg\min}\quad&-\text{tr}\left(T^{\top}PT\right)\\
\text{s.t.}\quad& T^{\top}T=I\\
\end{aligned}
$$

ניתן להראות שהפתרון לבעיה זו הינה המטריצה $T$ שתוארה בפתרון על ידי שימוש באינדוקציה, כאשר מתחילים מ $K=1$ ומגדילים אותו כל פעם ב 1.

### דוגמא

נציג דוגמא לפירוק PCA של תמונות. נתייחס לתמונות בעל וקטור ארוך של פיקסלים. בדומא הבאה נסתכל על תמונות של 381 פיקסלים. 20 הכיוונים העיקריים (הוקטורים העצמיים המתאימים לערכים העצמיים הכי גדולים) הינם:

<div class="imgbox" style="max-width:900px">

![](./assets/faces_pca_basis.png)

</div>

נציג כעת את התמונה המשוחזרת בעבור ערכים שונים של $K$:

<div class="imgbox" style="max-width:900px">

![](./assets/faces_pca_reconstruction.png)

</div>

## אשכול

באלגוריתמי אשכול ננסה לחלק אוסף של פרטים לקבוצות המכונים אשכולות (clusters), כאשר לכל קבוצה איזשהן תכונות דומות.

<div class="imgbox" style="max-width:100%">
<div class="imgbox no-shadow" style="max-width:40%;display:inline-block;margin:0">

![](./output/gaussians_data.png)

</div>
<span style="font-size: 6rem; color=blue">&#x21E6;</span>
<div class="imgbox no-shadow" style="max-width:40%;display:inline-block;margin:0">

![](./output/gaussians_clusters.png)

</div>
</div>

2 דוגמאות למקרים שבהם נרצה לאשכל אוסף נתונים:

1. על מנת לבצע הנחות על אחד מהפרטים באשכול על סמך פרטים אחרים באשכול. לדוגמא: להציע ללקוח מסויים בחנות אינטרנט מוצרים על סמך מוצרים שקנו לקוחות אחרים באשכול שלו.
2. לתת טיפול שונה לכל אשכול. לדוגמא משרד ממשלתי שרוצה להפנות קבוצות שונות באוכלוסיה לערוצי מתן שירות שונים: אפליקציה, אתר אינטרנט, נציג טלפוני או הפניה פיסית למוקד שירות.

### אלגוריתמי אשכול שונים

קיימות דרכים רבות לבצע אישכול לאוסף של נתונים. בהתאם לכך קיימים גם מספר רב של אלגוריתמים לעשות כן. בתיעוד של החבילה הפייתונית  [scikit-learn](https://scikit-learn.org/), בה נעשה שימוש רב בתרגילים הרטובים בקורס, ישנה השוואה בין האשכולות המתקבלים מאלגוריתמים האישכול השונים בחבילה, בעבור שישה toy models דו מימדיים:

<div class="imgbox" style="max-width:900px">

![](./assets/sphx_glr_plot_cluster_comparison_0011.png)

</div>

נציין כי לרוב נעבוד עם נתונים ממימד גבוה, שם לא נוכל, כמו כאן, לצייר את האשכולות על מנת להבין את אופי החלוקה.

בקורס זה נלמד על האלגוריתם K-means (העמודה השמאלית ביותר).

## K-Means

K-Means הוא אלגוריתם אשכול אשר מנסה לחלק את הדגימות במדגם ל $K$ קבוצות על סמך המרחק בין הדגימות.

### סימונים

- $K$ - מספר האשכולות (גודל אשר נקבע מראש).
- $\mathcal{I}_k$ - אוסף האינדקסים של האשכול ה-$k$. לדוגמא: $\mathcal{I}_5=\left\lbrace3, 6, 9, 13\right\rbrace$
- $|\mathcal{I}_k|$ - גודל האשכול ה-$k$ (מספר הפרטים בקבוצה)
- $\{\mathcal{I}_k\}_{k=1}^K$ - חלוקה מסויימת לאשכולות

### בעיית האופטימיזציה

בהינתן מדגם $\mathcal{D}=\{\boldsymbol{x}^{(i)}\}_{i=1}^N$, K-Means מנסה למצוא את החלוקה לאשכולות אשר תמזער את המרחק הריבועי הממוצע בין כל דגימה לכל שאר הדגימות שאיתו באותו האשכול. זאת אומרת, K-means מנסה לפתור את בעיית האופטימיזציה הבאה:

$$
\underset{\{\mathcal{I}_j\}_{k=1}^K}{\arg\min}\frac{1}{N}\sum_{k=1}^K\frac{1}{2|\mathcal{I}_k|}\sum_{i,j\in\mathcal{I}_k}\lVert\boldsymbol{x}^{(j)}-\boldsymbol{x}^{(i)}\rVert_2^2
$$

### הבעיה השקולה

נגדיר את מרכז המסה של כל אשכול כממוצע של כל הוקטורים באשכול:

$$
\boldsymbol{\mu}_k=\frac{1}{|\mathcal{I}_k|}\sum_{i\in\mathcal{I}_k}\boldsymbol{x}^{(i)}
$$

ניתן להראות כי בעיית האופטימיזציה המקורית, שקולה לבעיה של מיזעור המרחק הממוצע של הדגימות ממרכז המסה של האשכול:

$$
\underset{\{\mathcal{I}_j\}_{k=1}^K}{\arg\min}\frac{1}{N}\sum_{k=1}^K\sum_{i\in\mathcal{I}_k}\lVert\boldsymbol{x}^{(i)}-\boldsymbol{\mu}_k\rVert_2^2
$$

### האלגוריתם

K-mean הוא אלגוריתם חמדן אשר בכל פעם משייך מחדש את הדגימות ומעדכן את המרכזים.

האלגוריתם מאותחל בצעד $t=0$ על ידי בחירה אקראית של $K$ מרכזי מסה: $\{\mu_k\}_{k=1}^K$.

בכל צעד $t$ מבצעים את שתי הפעולות הבאות:

1. עדכון מחדש את החלוקה לאשכולות $\{\mathcal{I}_k\}_{k=1}^K$ כך שכל דגימה משוייכת למרכז המסה הקרוב עליה ביותר. כלומר אנו נשייך את כל דגימה $\boldsymbol{x}$ לפי:

    $$
    k=\underset{k\in[1,K]}{\arg\min} \lVert\boldsymbol{x}-\boldsymbol{\mu}_k\rVert_2^2
    $$

    (במקרה של שני מרכזים במרחק זהה נבחר בזה בעל האינדקס הנמוך יותר).

2. עדכון של מרכזי המסה המסה על פי:

    $$
    \boldsymbol{\mu}_k=\frac{1}{|\mathcal{I}_k|}\sum_{i\in\mathcal{I}_k}\boldsymbol{x}^{(i)}
    $$

    (אם $|\mathcal{I}_k|=0$ אז משאירים אותו ללא שינוי)

תנאי העצירה של האלגוריתם הינו כשהאשכולות מפסיקות להשתנות.

אחת הדרכים הנפוצות לאיתחול של $\{\mu_k\}_{k=1}^K$ היא לבחור $k$ נקודות מתוך המדגם.

### תכונות

- מובטח כי פונקציית המטרה (סכום המרחקים מהממוצעים) תקטן בכל צעד.
- מובטח כי האלגוריתם יעצר לאחר מספר סופי של צעדים.
- **לא** מובטח כי האלגוריתם יתכנס לפתרון האופטימאלי, אם כי בפועל במרבית המקרים האלגוריתם מתכנס לפתרון אשר קרוב מאד לאופטימאלי.
- אתחולים שונים יכולים להוביל לתוצאות שונות.

### דוגמא

אתחול (וחלוקה ראשונית לאשכולות):

<div class="imgbox" style="max-width:400px">

![](./output/gaussians_step1a.png)

</div>

עדכון המרכזים:

<div class="imgbox" style="max-width:400px">

![](./output/gaussians_step1b.png)

</div>

עדכון האשכולות:

<div class="imgbox" style="max-width:400px">

![](./output/gaussians_step2a.png)

</div>

עדכון המרכזים:

<div class="imgbox" style="max-width:400px">

![](./output/gaussians_step2b.png)

</div>

וחוזר חלילה (הסדר הוא מימין לשמאל):

<div class="imgbox" style="max-width:100%">
<div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step3a.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step3b.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step4a.png)

</div>
</div>

<div class="imgbox" style="max-width:100%">
<div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step4b.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step5a.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/gaussians_step5b.png)

</div>
</div>

</div>

