---
type: tutorial
index: 4
template: page
make_docx: true
print_pdf: true
---

<div dir="rtl" class="site-style">

# תרגול 4 - Generalization & overfitting

<div dir="ltr">
<a href="/assets/tutorial04.pdf" class="link-button" target="_blank">PDF</a>
<a href="./code/" class="link-button" target="_blank">Code</a>
</div>

## תקציר התיאוריה

### מושגים

- **הכללה (generalization)**: היכולת להסיק מן הפרט אל הכלל. היכולת של המודל להפיק תוצאות טובות גם על דגימות אשר לא הופיעו במדגם.
- **Overfitting (התאמת יתר)**: התופעה שבה המודל לומד מאפיינים אשר מופיעים רק במדגם ואינם הם אינם מייצגים את התכונות של הפילוג האמיתי. Overfitting פוגע ביכולת ההכללה.
- **הערכת הביצועים / הציון של חזאי (יכולת הכללה)**: הערכת המחיר (המתקבל מפונקציית המחיר) המתקבל בעבור חזאי נתון על הפילוג האמיתי.
- **יכולת הביטוי (expressiveness) של מודל פרמטרי**: היכולת של מודל פרמטרי לייצג (או לקרב) מכוון רחב של מודלים. לדוגמא לפולינום מסדר מאד גבוהה יהיה יכולת ביטוי גבוהה בעוד שלמודל לינארי תהיה יכולת ביטוי נמוכה.
- **Hyper parameters** - הפרמטריים אשר משפיעים על המודל הפרמטרי או האלגוריתם, אך אינם חלק מהפרמטרים שעליהם אנו מבצעים את האופטימיזציה. דוגמאות:
  - סדר הפולינום שבו אנו משתמשים
  - הפרמטר $\eta$ אשר קובע את גודל הצעד באלגוריתם ה gradient descent.
  - פרמטרים אשר קובעים את המבנה של רשת נוירונים.
- **סדר המודל**: כאשר ישנו hyper-parameter אשר שולט ביכולת הביטוי של המודל הפרמטרי (כגון המקרה של סדר של פולינום) אנו נכנה פרמטר זה לרוב הסדר של המודל.

### הערכת ביצועים בעזרת test set (סט בחן)

במקרים בהם פונקציית המחיר מוגדרת בעזרת תוחלת (כמו במקרה הנפוץ של שימוש בפונקציות סיכון / הפסד) ניתן לשערך אך את ביצועיו של חזאי מסויים על ידי שימוש בתוחלת אמפירית ומדגם נוסף . לשם כך נפצל את המודל שני תתי מדגמים:

- **Train set (סט אימון)**: בו נשתמש לבנות את החזאי.
- **Test set (סט בחן)**: בו נשתמש בכדי להעריך את ביצועי המערכת.

#### גדולו של ה test set

מצד אחד נרצה שסט הבחן יהיה גדול מספיק על מנת שיקרב בצורה טובה את ביצועיו האמיתיים של המודל אך מצד שני לא נרצה לגרוע יותר מידי דגימות מה training set. במקרים בהם המדגם מספיק לא תהיה בעיה להפריש test set מספיק גדול מבלי לפגוע משמעותית בגודל המדגם, במקרים אחרים מקבול להשתמש בפיצול של 80% train ו20% test.

### פירוק שגיאת החיזוי

בקורס זה נציג שני פירוקים נפוצים של שגיאת החיזוי בבעיות supervised learning.

#### Aprroxiamtion-estimation decomposition

פירוק זה הוא רק רעיוני ולרוב לא ניתן לחשב אותו בפועל. בפירוק זה נתייחס לשלושת הגורמים הבאים בשגיאת החיזוי:

1. **Noise - ה"רעש" של התויות**: השגיאה שהחזאי האופטימאלי צפוי לעשות. שגיאה זו נובעת מהאקראיות של התויות $y$.
2. **Approximation error - שגיאת קירוב**: השגיאה עקב ההגבלה של המודל למשפחה מצומצמת של מודלים (לרוב למודל פרמטרי). שגיאה זו נובעת מההבדל בין המודל האופטימאלי $h^*$ לבין המודל **הפרמטרי** האופטימאלי $h^*(\cdot,\boldsymbol{\theta})$.
3. **Estimation error - שגיאת השיערוך**: השגיאה הנובעת מהשימוש במדגם כתחליף לפילוג האמיתי ןחוסר היכולת שלנו למצוא את המודל הפרמטרי האופטימאלי. שגיאה זו נובעת מההבדל בין המודל הפרמטרי האופטימאלי $h^*(\cdot,\boldsymbol{\theta})$ למודל הפרמטרי המשוערך על סמך המדגם $h_{\mathcal{D}}^*(\cdot,\boldsymbol{\theta})$.

<div class="imgbox" style="max-width:500px">

![](../lecture03/assets/models_diagram_approx_estim_decomp.png)

</div>

#### Bias-variance decomposition

פירוק זה מתייחס למקרים שבהם פונקציית המחיר הינה MSE (או RMSE).

בפירוק זה נתייחס לחזאי ה"ממוצע" המתקבל כאשר לוקחים תוחלת על כל חזאים אשר יכוללים להתקבל בעבור כל המדגמים האפשריים. בעבור אלכוריתם אשר בהינתן מדגם $\mathcal{D}$ מייצר חזאי $h_{\mathcal{d}}$ נגדיר את החזאי ה"ממוצע" כ:

$$
\bar{h}(x)=\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)|x\right]
$$

(הסימון של $\mathcal{D}$ מתחת ל $\mathbb{E}$ אינו נחוץ מתמטית והסופנו אותו רק בכדי להזכיר את העובדה שאנו שהמדגם $\mathcal{D}$) הינו גם משתנה אקראי ושהתוחלת מתבצעת גם עליו).

בנוסף בעבור המקרה של MSE אנו יודעים כי החזאי האופטימאלי הינו: $h^*(x)=\mathbb{E}\left[\text{y}|x\right]$. על בסיס שני חזאים אלו ניתן לפרק התוחלת הצפויה של שגיאת ה MSE של אלגוריתם נתון באופן הבא:

$$
\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-y)^2\right]
=\underbrace{\mathbb{E}\left[(\bar{h}(\text{x})-h^*(\text{x}))^2\right]}_{\text{Bias}^2}
+\underbrace{\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\bar{h}(\text{x}))^2\right]}_{\text{Variance}}
+\underbrace{\mathbb{E}\left[(h^*(\text{x})-y)^2\right]}_{\text{Noise}}
$$

בפירוק הזה:

- ה variance מודד את השונות של התוצאות החיזוי המתקבלות סביב החזאי הממוצע. תוחלת זו היא גם על פני המדגמים השונים אותם ניתן לקבל (שאר האיברים לא תלויים במדגם).
- ה bias מודד את ההפרש הריבועי בין החיזוי של החזאי הממוצע של השיטה לבין החזאי האופטימאלי.
- ה noise מודד את השגיאה הריבועית המתקבלת מהחזאי האופטימאלי (הנובעת מהאקראיות של $y$).

בתרגיל 4.1 נפתח את הפירוק הזה.

אילוסטרציה של bias ו variance:

<div class="imgbox" style="max-width:500px">

![](../lecture03/assets/bias_and_variance.png?1)

</div>

##### Tradeoffs

המודל הפרמטרי שאיתו נבחר לעבוד ישפיע על גודלם של השגיאות אותם נקבל. לרוב התלות של השגיאות במודל הפרמטרי תקיים את הקשר הבא:

- **מודל פרמרטי עשיר**, אשר יכול לייצג מגוון מאד עשיר של מודלים יהיה בעל **שגיאת קירוב / bias נמוך** אך **שגיאת שיערוך / variance גבוה**.
- **מודל פרמרטי דל**, אשר יכול לייצג מגוון מאד עשיר של מודלים יהיה בעל **שגיאת שיערוך / variance נמוך** אך **שגיאת קירוב / bias גבוה**.

המודל בעל יכולת ההכללה הטובה ביותר ימצא באיזו שהיא נקודת ביניים בין שני הקצוות הנל, כפי שמתואר בשירטוט הסכימתי הבא:

<div class="imgbox" style="max-width:500px">

![](../lecture03/assets/bias_variance_tradeoff.png)

</div>

### שימוש ב validataion set לקביעת hyper-parameters

לרוב לא תהיה לנו דרך לקבוע מראש מה צריך להיות ערכם של ה hyper-parameters על מנת לקבל תוצאות אופטימאליות. במקרים אלו אנו נאלץ לבדוק ערכים שונים ולבחור מתוכם.לשם הערכת הביצועים המתקבלים בעבור בחירה מסויימת של ערכים אנו נאלץ להשתמש סט דגימות שלישי שונה מה train set וה test set אשר מוכנה validation set. לרוב ה validataion set יהיה מופרש מתוך ה train set.

קביעת ה hyper-parameters תעשה לרוב על ידי הרצת האלגוריתם מספר פעמים עם ערכים שונים בעבור ה hyper-parametrs, הערכת הביצועים על ה validation set, ובחירת הערכים אשר נתנו את התוצאה הטובה ביותר. במקרים רבים תהליך קביעת הפרמטרים יהיה תהליך איטרטיבי של ניסוי וטעיה.

במקרים רבים לאחר קביעת ה hyper-parmaeters אנו נאחד חזרה את ה validation set וה train set ונאמן מחדש את המודל על המדגם המאוחד (כל הדגימות מלבד ה test set).

### רגולריזציה

דרך נוספת לנסות ולהקטין את ה overfitting של המודל על ידי הוספת איבר רגולריזציה לבעיית האופטימיזציה. מטרת איבר הרגולריזציה הינה לבטא ידע מוקדם שיש לנו על אופי הבעיה אל יעי כך שהוא נותן ציון גבוהה למודלים שלדעתינו פחות סבירים וציון נמוך למודים אשר יותר סבירים לדעתינו. לרוב אנו נוסיף את איבר הרגולריציה יחד עם קבוע כפלי נוסף $\lambda$ אשר קובע את המשקל שאנו מעוניינים לתת לרגולריזציה.

בעיות אופטימיזציה עם רגולריזציה יהיו מהצורה הבא:

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\underbrace{f(\boldsymbol{\theta})}_{\text{The regular objective function}}+\lambda\underbrace{g(\boldsymbol{\theta})}_{\text{The regularization term}}
$$

שני הרגולריזציות הנופות ביותר הם:

- $l_1$ - אשר מוסיפה איבר רגולריזציה של $g(\boldsymbol{\theta})=\lVert\boldsymbol{\theta}\rVert_1$.
- $l_2$ - (Tikhonov regularizaion) אשר מוסיפה איבר רגולריזציה של $g(\boldsymbol{\theta})=\lVert\boldsymbol{\theta}\rVert_2^2$.

רגולריזציית אלו מנסות לשמור את הפרמטריים כמה שיותר קטנים. המוטיבציה מאחורי הרצון לשמור את הפרמטרים קטנים הינה העובדה שבמרבית המודלים ככל שהפרמטרים קטנים יותר המודל הנלמד בעל נגזרות קטונות יותר ולכן הוא משתנה לאט יותר ופחות "משתולל".

המשקל אותו אנו נותנים לרגולריזציה $\lambda$ הוא hyper-parameter של האלגוריתם .

#### דוגמא: בעיות LLS עם רגולריזציה

##### Ridge regression: LLS + $l2$ regularization

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_i(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})+\lambda\lVert\boldsymbol{\theta}\rVert_2^2
$$

גם לבעיה זו יש פתרון סגור והוא נתון על ידי:

$$
\boldsymbol{\theta}^*=(X^{\top}X+\lambda)^{-1}X^{\top}\boldsymbol{y}
$$

אנו נראה את הפתוח של פתרון זה בתרגיל 4.2.

##### LASSO: LLS + $l1$ regularization

(LASSO = Linear Absolute Shrinkage and Selection Opperator)

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_i(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})+\lambda\lVert\boldsymbol{\theta}\rVert_1
$$

לבעיה זו אין פתרון סגור ויש צורך להשתמש באלגוריתמים איטרטיביים כגון gradient descent.

## תרגיל 4.1 - Bias-variance decomposition

**1)** הראו כי בעבור משתנה אקראי כל שהוא $\text{x}$ וקבוע $a$ ניתן לפרק את התחולת של המרחק הריבועי בין $\text{a}$ לבין $a$ באופן הבא:

$$
\mathbb{E}\left[(\text{x}-a)^2\right]
=\underbrace{\mathbb{E}\left[(\text{x}-\mathbb{E}\left[\text{x}\right])^2\right]}_{=\text{Var}(\text{x})}
+(\underbrace{\mathbb{E}\left[\text{x}\right]-a}_{\text{bias}})^2
$$

**2)** הראו כי בעבור אלגוריתם אשר מייצר חזאי $h_{\mathcal{D}}$ בהינתן מדגם $\mathcal{D}$ ניתן לפרק את התוחלת (על פני מדגמים שונים וחיזויים שונים) של שגיאת ה MSE באופן הבא:

$$
\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-y)^2\right]
=\underbrace{\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-\bar{h}(\text{x}))^2\right]}_{\text{Variance}}
+\underbrace{\mathbb{E}\left[(\bar{h}(\text{x})-h^*(\text{x}))^2\right]}_{\text{Bias}^2}
+\underbrace{\mathbb{E}\left[(h^*(\text{x})-y)^2\right]}_{\text{Noise}}
$$

כאשר:

$$
\bar{h}(x)=\mathbb{E}\left[h_{\mathcal{D}}(x)|x\right]
$$

ו

$$
h^*(x)=\mathbb{E}\left[\text{y}|x\right]
$$

הדרכה:

1. השתמשו בהחלקה על $\text{x}$ ו $\mathcal{D}$ ובזהות סעיף 1 הקודם על מנת להראות ש:

   $$
   \mathbb{E}_{\mathcal{D}}\left[(h^*_{\mathcal{D}}(\text{x})-y)^2\right]=
       \mathbb{E}_{\mathcal{D}}\left[(h^*_{\mathcal{D}}(\text{x})-h^*(\text{x}))^2\right]
       +\mathbb{E}\left[(h^*(\text{x})-\text{y})^2\right]
   $$

2. השתמשו בהחלקה על $\text{x}$ ובזהות מסעיף 1 על מנת להראות שניתן לפרק את האיבר הראשון ביטוי הקודם באופן הבא:

   $$
   \mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-h^*(\text{x}))^2\right]
   =\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\bar{h}(\text{x}))^2\right]
   +\mathbb{E}\left[(\bar{h}(\text{x})-h^*(\text{x}))^2 \right]
   $$

**3)** הניחו כי כאשר גודל המדגם הולך וגדל החזאי המתקבלים מהמודל מתכנסים (במובן הסתברותי) לחזאי ה"ממוצע": $h_{\mathcal{D}}\rightarrow\bar{h}$. מה תוכלו לומר על התלות של איברי השגיאה בגודל המדגם?

(ניתן להניח שכפי שקורה במרית האלגורימתמים $\bar{h}$ אינו תלוי בגודל המגדם)

**4)** על פי תוצאת הסעיף הקודם, כיצד לדעתכם עסוי ישפיע גודל המדגם על סדר המודל שאותו נרצה לבחור?

### פתרון 4.1

#### 1)

נוכיח תחילה את הזהות. זוהי למעשה הכללה של הקשר הבא למשתנים אקראיים:

<div class="imgbox" style="max-width:500px">

![](./assets/center_of_mass.png)

</div>

$$
\begin{aligned}
\mathbb{E}\left[(\text{x}-a)^2\right]
=&\mathbb{E}\left[(
    (\text{x}-\mathbb{E}\left[\text{x}\right])
    +(\mathbb{E}\left[\text{x}\right]-a)
    )^2\right]\\
=&\mathbb{E}\left[(\text{x}-\mathbb{E}\left[\text{x}\right])^2\right]
-2\mathbb{E}\left[
    (\text{x}-\mathbb{E}\left[\text{x}\right])
    (\mathbb{E}\left[\text{x}\right]-a)
    \right]
+\mathbb{E}\left[(\mathbb{E}\left[\text{x}\right]-a)^2\right]\\
=&\mathbb{E}\left[(\text{x}-\mathbb{E}\left[\text{x}\right])^2\right]
-2(\underbrace{\mathbb{E}\left[\text{x}\right]-\mathbb{E}\left[\text{x}\right]}_{=0})
  (\mathbb{E}\left[\text{x}\right]-a)
+\mathbb{E}\left[(\mathbb{E}\left[\text{x}\right]-a)^2\right]\\
=&\mathbb{E}\left[(\text{x}-\mathbb{E}\left[\text{x}\right])^2\right]
+(\mathbb{E}\left[\text{x}\right]-a)^2
\end{aligned}
$$

#### 2)

נפעל על פי ההדרכה. נחליק על פי $\text{x}$ ו $\mathcal{D}$ ונפעיל את הזהות מסעיף 1 על התוחלת הפנימית:

$$
\begin{aligned}
\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-y)^2\right]
&=\mathbb{E}\left[\mathbb{E}\left[(\underbrace{h_{\mathcal{D}}(\text{x})}_{:=a}-y)^2\middle|\text{x},\mathcal{D}\right]\right]\\
&=\mathbb{E}\left[
    (h_{\mathcal{D}}(\text{x})-\mathbb{E}\left[y\middle|\text{x},\mathcal{D}\right])^2
    +\mathbb{E}\left[(\mathbb{E}\left[\text{y}|x,\mathcal{D}\right]-\text{y})^2\middle|\text{x},\mathcal{D}\right]
    \right]
\end{aligned}
$$

מיכוון שהאיבר היחיד שתלוי במדגם $\mathcal{D}$ הינו $h_{\mathcal{D}}$ נוכל להסיר את ההתניה בו מהתוחלות הפנימיות:

$$
\begin{aligned}
&=\mathbb{E}\left[
    (h_{\mathcal{D}}(\text{x})-\mathbb{E}\left[y\middle|\text{x}\right])^2
    +\mathbb{E}\left[(\mathbb{E}\left[\text{y}|x\right]-\text{y})^2\middle|\text{x}\right]
    \right]\\
&=\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}\left[y\middle|\text{x}\right])^2\right]
+\mathbb{E}\left[\mathbb{E}\left[(\mathbb{E}\left[\text{y}|x\right]-\text{y})^2\middle|\text{x}\right]\right]\\
&=\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}\left[y\middle|\text{x}\right])^2\right]
+\mathbb{E}\left[(\mathbb{E}\left[\text{y}|x\right]-\text{y})^2\right]
\end{aligned}
$$

נשתמש כעת בעובדה ש $\mathbb{E}\left[\text{y}|x\right]=h^*(\text{x})$ ונקבל:

$$
=\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-h^*(\text{x}))^2\right]
+\mathbb{E}\left[(h^*(\text{x})-\text{y})^2\right]
$$

בביטוי שקיבלנו האיבר הראשון הוא למעשה השגיאה הנובעת מההבדל בין החיזוי של מודל האידאלי לבין החיזוי של מודל ספציפי ששנוצר ממדגם מסויים. נשים לב שהאיבר הראשון לא תלוי בכלל בפילוג של $\text{y}$. האיבר השני בביטוי שקיבלנו הוא השגיאה אותה עושה החזאי האופטימאלי והיא נובע מחוסר היכולת לחזות את $\text{y}$ במדוייק. נשים לב כי האיבר השני לא תלוי כלל במדגם.

נמשיך ונפרק את האיבר הראשון על פי ההדרכה. נבצע החלקה על $\text{x}$ ונשתמש בזיהות מסעיף 1:

$$
\begin{aligned}
\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-h^*(\text{x}))^2\right]
&=\mathbb{E}\left[\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-h^*(\text{x}))^2\middle|\text{x}\right]\right]\\
&=\mathbb{E}\left[
    \mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(\text{x})\middle|\text{x}\right])^2\middle|\text{x}\right]
    +(\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(\text{x})\middle|\text{x}\right]-h^*(\text{x}))^2
    \right]\\
&=\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(\text{x})\middle|\text{x}\right])^2\right]
+\mathbb{E}\left[(\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(\text{x})\middle|\text{x}\right]-h^*(\text{x}))^2 \right]
\end{aligned}
$$

נשתמש בסימון $\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(\text{x})\middle|\text{x}\right]=\bar{h}(\text{x})$ ונקבל:

$$
\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\bar{h}(\text{x}))^2\right]
+\mathbb{E}\left[(\bar{h}(\text{x})-h^*(\text{x}))^2 \right]
$$

זהו הפירוק של השגיאה לרכיב ה variance של החזאי אשר מבטא את השגיאה הצפויה עקב ההשתנות של החזאי כתלות במדגם שאיתו נעבוד, ורכיב bias אשר מבטא את השגיאה אשר נובעת מההבדל בין החזאי ה"ממוצע" והחזאי האידאלי.

כאשר נציב את הפירוק השני לפירוק הראשון נקבל את ה bias-variance decomposition:

$$
\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-y)^2\right]
=\underbrace{\mathbb{E}\left[(h_{\mathcal{D}}(\text{x})-\bar{h}(\text{x}))^2\right]}_{\text{Variance}}
+\underbrace{\mathbb{E}\left[(\bar{h}(\text{x})-h^*(\text{x}))^2\right]}_{\text{Bias}^2}
+\underbrace{\mathbb{E}\left[(h^*(\text{x})-y)^2\right]}_{\text{Noise}}
$$

#### 3)

ככל שפילוג של $h_{\mathcal{D}}$ יהיה מרוכז יותר סביב החזאיהגודל של רכיב ה variance יקטן וכך גם השגיאה הכוללת. שאר האיברים לא במקרה זה לא יושפעו מגודלו של המדגם.

#### 4)

השינוי של רכיב ה variance יכול כמובן להשפיע על סדר המודל האופטימאלי. באלגוריתמיים טיפוסיים שגיאת ה variance תהיה זו שמושכת את משפחת המודלים להיות כמה שיותר מצומצמת (בעוד ששגיאת ה bias כן מושכת בכיוון ההפוך). אנו נצפה שכאשר גודלה של שגיאה זו יקטן תקטן גם ההשפעה שלה על השגיאה הכוללת ולרוב נוכל להקטין עוד את השגיאה על ידי הגדלת סדר המודל הפרמטרי כך שייצג משפחה רחבה יותר של מודלים.

ננסה להמחיש זאת גם בעזרת הגרף הסכימתי הבא:

<div class="imgbox" style="max-width:600px">

![](./assets/bias_variance_tradeoff_less_variance.png)

</div>

כאשר הגרך של התלות של שגיאת ה variance ירד אנו מצפים כי נקודת המינימום של שגיאת המודל תזוז לכיוון של סדר גבוהה יותר.

ניתוח זה כמובן נשען על התנהגות טיפוסית של אלגוריתמי supervised learning ואין הכרח שהגדלת סדר המודל אכן תמשיך להקטין את השגיאה המתקבלת.

## תרגיל 4.2 - רגולריזציה

**1)** בעבור Rigde regression (המקרה של LLS + $l2$ regularization) רשמו את בעיית האופטימיזציה ופרתו אותה על ידי גזירה והשאווה ל-0.

**2)** נסתכל כעת על וריאציה של Ridge regression שבה אנו נותנים משקל שונה $w_i$ לרגולריזציה של כל פרמטר. זאת אומרת, אנו נרצה להשתמש באיבר רגולריזציה מהצורה:

$$
\sum_{i=1}^D w_i\theta_i^2
$$

(כאן $D$ הוא מספר הפרמטרים, זאת אומרת האורך של $\boldsymbol{\theta}$ אשר במודל לינארי שווה גם לאורך של $\boldsymbol{x}$).

הדרכה: הגדירו את מטריצת המשקלים $W=\text{diag}(\{w_i\})$, רשמו את הבעיה בכתיב מטריצי ופתרו אותה בדומה לסעיף הקודם.

**3)** נסתכל כעת על אלגוריתם כללי שבו הפרמטרים של המודל נקבעים על פי בעיית האופטימיזציה הבאה

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}f(\boldsymbol{\theta})
$$

רשמו את הבעיות האופטימיזציה המקבלות לאחר הוספת של איבר רגולריזציה מסוג $l_1$ ו $l_2$.

**4)** רשמו את כלל העדכון של אלגוריתם הגרדיאנט בעבור כל אחד משני הרגולריזציות.

**5)** על סמך ההבדל בין שני הכללי העדכון הסבירו מה הבדל בין האופן שבו שני הרגולריזציות מנסות להקטין את הפרמטרים.

**6)** על סמך שני כללי העדכון הסבירו מדוע רגולריזציית $l_1$ נוטה יותר לאפס פרמטרים מאשר רגולריזציית $l_2$. (הניחו שצעדי העדכון קטנים מאד)

### פתרון 4.2

#### 1)

תזכורת, בעיית ה LLS היא המקרה שבו אנו משתמשים ב

- MSE או RMSE כפונקציית המחיר / סיכון.
- ERM.
- מודל לינארי

בעיית האופטימיזציה של LLS הינה:

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_{i=0}^N(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2
$$

כאשר נוסיף לבעיית האופטימיזציה איבר של רגולריזציית $l_2$ נקבל: 

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_{i=0}^N(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2+\lambda\lVert\boldsymbol{\theta}\rVert_2^2
$$

על מנת לפתור את בעיית האופטימיזציה נשרום את הבעיה בכתיב וקטורי בדומה לבעיית ה LLS המקורית. נגדיר

$$
\boldsymbol{y}=[y^{(1)},y^{(2)},\cdot,y^{(n)}]^{\top}
\qquad
X=\begin{bmatrix}
- & \boldsymbol{x}^{(1)} & - \\
- & \boldsymbol{x}^{(2)} & - \\
& \vdots & \\
- & \boldsymbol{x}^{(N)} & -
\end{bmatrix}
$$

ונרשום את בעיית האופטימיזציה כ:

$$
\boldsymbol{\theta}^*
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
+\lambda\lVert\boldsymbol{\theta}\rVert_2^2
$$

נזגור ונשווה ל-$0$. נשתמש בנזגרת המוכרת $\nabla_{\boldsymbol{x}}\lVert\boldsymbol{x}\rvert_2^2=2\boldsymbol{x}$:

$$
\begin{aligned}
\nabla_{\boldsymbol{\theta}}\left( \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
+\lambda\lVert\boldsymbol{\theta}\rVert_2^2\right)=&0\\
\Leftrightarrow \frac{2}{N}X^{\top}(X\boldsymbol{\theta}-\boldsymbol{y})
+2\lambda\boldsymbol{\theta}=&0\\
\Leftrightarrow (X^{\top}X+N\lambda I)\boldsymbol{\theta}=&
X^{\top}\boldsymbol{y}\\
\Leftrightarrow \boldsymbol{\theta}=&
(X^{\top}X+N\lambda I)^{-1}X^{\top}\boldsymbol{y}\\
\end{aligned}
$$

ניתן כמובן "לבלוע" את ה$N$ בתוך הפרמטר $\lambda$, אך שינוי זה מצריך להתאים את הפרמטר $\lambda$ לגודל המדגם ולעדכנו כאשר גודל המדגם משתנה (נגיד במקרה בו ממפרישים חלק מהמדגם ל validation set).

#### 2)

בעיית האופטימיזציה כעת תהיה

$$
\boldsymbol{\theta}^*
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
+\lambda\sum_{i=1}^D w_i\theta_i^2
$$

נפעל על פי ההדרכת. נגדיר את המטריצה:

$$
W=\begin{bmatrix}
w_1 & 0 & \dots & 0 \\
0 & w_2 & & 0 \\
\vdots &  & \ddots & \vdots \\
0 &  \dots & & w_D
\end{bmatrix}
$$

בעזרת מטריצה זו ניתן לרשום את בעיית האופטימיזציה באופן הבא:

$$
\boldsymbol{\theta}^*
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
+\lambda\boldsymbol{\theta}^{\top}W\boldsymbol{\theta}
$$

נגזור ונשווה ל-0:

$$
\begin{aligned}
\nabla_{\boldsymbol{\theta}}\left( \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
+\lambda\boldsymbol{\theta}^{\top}W\boldsymbol{\theta}\right)=&0\\
\Leftrightarrow \frac{2}{N}X^{\top}(X\boldsymbol{\theta}-\boldsymbol{y})
+2\lambda W\boldsymbol{\theta}=&0\\
\Leftrightarrow (X^{\top}X+N\lambda W)\boldsymbol{\theta}=&
X^{\top}\boldsymbol{y}\\
\Leftrightarrow \boldsymbol{\theta}=&
(X^{\top}X+N\lambda W)^{-1}X^{\top}\boldsymbol{y}\\
\end{aligned}
$$

#### 3)

בעיית האופטימיזציה בתוספת רגולריזציית $l_2$ תהיה:

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}f(\boldsymbol{\theta})
+\lambda\lVert\boldsymbol{\theta}\rVert_2^2
$$

בעיית האופטימיזציה בתוספת רגולריזציית $l_1$ תהיה:

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}f(\boldsymbol{\theta})
+\lambda\lVert\boldsymbol{\theta}\rVert_1
$$

#### 4)

כלל העדכון של gradient decsent הינו:

$$
\boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta\nabla_{\boldsymbol{\theta}} g(\boldsymbol{\theta^{(t)}})
$$

כאשר $g(\boldsymbol{\theta})$ היא פונקציית המטרה של בעיית האפטימזציה. בעבור רגולריזציית ה $l_2$ נקבל:

$$
\boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta\nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta^{(t)}})-2\eta\lambda\boldsymbol{\theta^{(t)}}
$$

בעבור רגולריזציית ה $l_1$ נקבל:

$$
\boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta\nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta^{(t)}})-2\eta\lambda\cdot\text{sign}(\boldsymbol{\theta}^{(t)})
$$

כאשר פונקציית ה$\text{sign}$ פועלת איבר איבר.

#### 5)

שני האיברים שנוספו לכלל העדכון מנסים בכל צעד להקטין את וקטור הפרמטריים ולקרב אותו ל-0. ההבדל בין שני האיברים הינו שבעוד שהאיבר המתקבל ברגולריזציית ה $l_2$ הינו פורפוציוני לגודל של האיברים בוקטור הפרמטרים האיבר של רגולריזציית ה $l_1$ הוא קבוע (עד כדי סימן). המשמעות של זה הינה שב $l_2$ כלל שפרמטר מוסיים גדול יותר כך הרגולריזציה תתאמץ יותר להקטין אותו ויחסית פחות תשפיע על הפרמטרים הקטנים. מהגד, רגולריזצייית ה $l_1$ תפעל להקטין את כל האיברים ללא קשר לגודלם.

#### 6)

כפי שציינו בסעיף הקודם, רגולריזציית ה $l_1$ תשפיע באופן מועט יחסית על האיברים הקטנים ולא תתאמץ להקטין אותם ובעיקר תפעל להקטין את האיברים הגדולים. מנגד, רגולריזציית ה $l_1$ תמשיך ולנסות להקטין את האיברים כל עוד הם שונים מ-0 ולכן בפועל היא תיטה לאפס יותר איברים.

**הערה**: בפועל בגלל שגודלו של איבר הרגולריזציה של $l_1$ קבוע הוא יקטין את האיברים לערכים קרובים ל-0 ואז יתחיל להתנדנד סביב ה-0.

## K-fold cross validation

במקרים בהם גודלו של המדגם שנתון לנו הינו קטן לא נוכל להקצות כמות גדולה של דגימות לטובת ה validation set. במקרים כאלה ה validation עלול להיות לא מאד מייצג ולפגוע בבחירה של ה hyper-parmeters. במקרים כאלה נרצה למצוא דרך טובה יותר להעריך את ביצועי המודל בעבור כל בחירה של hyper-parameters. שיטת ה K-fold cross validataion מציעה שיטה לשפר הדיוק על הערכת הביצועים על ידי מיצוע על כמה validation sets.

בשיטה זו נחלק את ה train set שלנו ל $K$ קבוצות ונבצע את הערכת הביצויים $K$ פעמים באופן הבא:

1. בכל פעם נבחר (על פי הסדר) אחת הקבוצות לשמש כ validation set הנוכחי.
2. בניה של מודל על סמך ה $K-1$ קבוצות האחרות
3. חישוב הביצועים של המודל על סמך הקבוצה שנבחרה.

הביצועיים הכוללים יהיו הממוצע של התוצאות אשר התקבלו ב $K$ החזרות.

גדולים אופיינים ל $K$ הינם בין 5 ל10.

כמו תמיד, לאחר קבעית ה hyper-parameters ניתן לאחד חזרה את כל הקבוצות ל train set אחד ולבנות בעזרתו את המודל תוך שימוש ב hyper-parameters שנבחרו.

סכימה של החלוקה של המדגם בעבור בחירה של $K=5$ (לקוח מתוך התיעוד של החבילה [scikit learn](https://scikit-learn.org/stable/modules/cross_validation.html)):

<div class="imgbox no-shadow" style="max-width:600px">

![](./assets/k_fold_cross_validation.png)

</div>

### Leave-one-out cross validation

במקרים מסויימים (בעיקר כשאר ה train set מאד קטן) אנו נבחר לקחת את $K$ להיות שווה למספר האיברים שב train set. במקרה זה גודלה של כל קבוצה יהיה 1. מקרה זה מוכנה לרוב Leave-one-out cross validation.

## תרגיל 4.3 - בחירת סדר המודל

נתון המדגם הבא:

$$
\mathcal{D}=\{\{6,4\},\{1,2\},\{4,5\},\{5,2\}\}
$$

<div class="imgbox">

![](./output/ex_4_3_dataset.png)

</div>

נרצה לנסות והתאים למדגם הנתון אחד משני מודלים: מודל לינארי מסדר 0 (פונקציה קבועה) או מסדר ראשון (פונקציה לינארית עם היסט). בתרגיל זה נבחן דרכים לקביעת סדר המודל.

נפצל את המדגם כך ששלושת הדגימות הראשונות יהיו הtrain set והאחרונה תהיה ה test set.

**1)** השתמשו ב LLS על מנת להתאים כל אחד משני המודלים המוצעים ל train set. העריכו את ביצועי החזאי על פי שגיאת החיזוי המתקבל על הנקודה שב train set. מי מהמודלים נותן ביצועים טובים יותר?

**2)** מדוע לא נרצה לבחור את סדר המודל על סמך ההשוואה שעשינו על ה test set?

משלב זה והלאה נשכח שביצענו את הערכת הביצועים על ה test set וננסה לקבוע את סדר המודל על סמך validation set.

**3)** הפרישו מתוך ה train set את הדגימה השלישית על מנת שתשמש כ validation set. התאימו כעת את שני המודלים ל train set החדש והעריכו את ביצועיהם על ה validation set.

**4)** במקום להשתמש ב validation set קבוע, השתמשו ב leave-one-out על מנת לבחור מבין שני המודלים.

### פתרון 4.3

#### 1)

נחלק את המדגם ל train set ו test set:

$$
\mathcal{D}_{\text{train}}=\{\{6,4\},\{1,2\},\{4,5\}\}
$$

$$
\mathcal{D}_{\text{test}}=\{\{5,2\}\}
$$

##### סדר 0

מודל מסדר 0 (פונקציה קבועה) הוא כמובן מקרה מנוון של מודל לינארי עם מאפיין יחיד של $\varphi(x)=1$. במקרה זה אנו מצפים כי המודל אשר ימזער את השגיאה הריבועית יהיה פשוט פונקציה קבועה אשר שווה ל $y$ הממוצע על ה train set. נראה כי זה אכן הפתרון המתקבל מתוך הפתרון הסגור. בעבור מודל זה המטריצה $X$ והוקטור $\boldsymbol{y}$ יהיו:

$$
X=[1, 1, 1]^{\top},\qquad \boldsymbol{y}=[4,2,5]^{\top}
$$

הפרמטר האופטימאלי $\theta^*$ יהיה:

$$
\theta^*=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}=\frac{\sum_{i=1}^N y^{(i)}}{N}=3\tfrac{2}{3}
$$

<div class="imgbox">

![](./output/ex_4_3_1_order_0.png)

</div>

שגיאת החיזוי תהיה במקרה זה $|2-3\tfrac{2}{3}|=1\tfrac{2}{3}$.

##### סדר ראשון

מודל זה הינו מודל לינארי עם המאפיינים:

$$
\varphi_1(x)=1,
\qquad
\varphi_2(x)=x
$$

המטריצה $X$ והוקטור $\boldsymbol{y}$ יהיו:

$$
X=\begin{bmatrix}1&6\\1&1\\1&4\end{bmatrix}
\qquad
\boldsymbol{y}=[4,2,5]^{\top}
$$

הפרמטרים האופטימאלים $\boldsymbol{\theta}^*$ יהיו:

$$
\theta^*=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}=[77,17]^{\top}/38
$$

<div class="imgbox">

![](./output/ex_4_3_1_order_1.png)

</div>

שגיאת החיזוי תהיה במקרה זה $|\tfrac{77}{38}+\tfrac{17}{38}\cdot 5-2|=2.263$.

על סמך שיגאת החיזוי על ה test set נראה שהמודל מסדר 0 עדיף.

#### 2)

תפקידו של ה test set הינו להעריך את ביצועי המודל הסופי לאחר שסיימנו את כל השלבים של בניית המודל כולל בחירת hyper parameters כגון סדר המודל. כאשר אנו מקבלים החלטה כל שהיא או קובעים פרמטר כל שהוא על סמך ה test set אנו למעשה גורמים למודל שלנו להתחיל לעשות overfitting ל test set הספציפי שבידינו ולכן לא נוכל להשתמש בו יותר על מנת הערכה בלתי מוטית של ביצועי המודל שלנו.

#### 3)

נקצה את הדגימה השלישית במדגם לטובת ה validation set:

$$
\mathcal{D}_{\text{train}}=\{\{6,4\},\{1,2\}\}
$$

$$
\mathcal{D}_{\text{validataion}}=\{\{4,5\}\}
$$

$$
\mathcal{D}_{\text{test}}=\{\{5,2\}\}
$$

נתאים שוב את שני המודלים על סמך ה train set החדש ונעריך את שגיאת החיזוי על ה validation set:

##### סדר 0

$$
X=[1, 1]^{\top},\qquad \boldsymbol{y}=[4,2]^{\top}
$$

$$
\theta^*=\frac{\sum_{i=1}^N y^{(i)}}{N}=3
$$

<div class="imgbox">

![](./output/ex_4_3_3_order_0.png)

</div>

שגיאת החיזוי על ה validation set תהיה במקרה זה $|3-5|=2$.

##### סדר ראשון

$$
X=\begin{bmatrix}1&6\\1&1\end{bmatrix}
\qquad
\boldsymbol{y}=[4,2]^{\top}
$$

הפרמטרים האופטימאלים $\boldsymbol{\theta}^*$ יהיו:

$$
\theta^*=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}=[8,2]^{\top}/5
$$

<div class="imgbox">

![](./output/ex_4_3_3_order_1.png)

</div>

שגיאת החיזוי על ה validation set תהיה במקרה זה $|\tfrac{8}{5}+\tfrac{2}{5}\cdot 4-5|=9/5$.

כעת נראה כי דווקא המודל מסדר ראשון הוא המודל העדיף. מכיוון ש ה validation set שלנו במקרה זה קטן מאד הוא לא מאד מייצג שינו סיכוי סביר שתוצאה זו התקבלה במקרה שעל הפילוג האמיתי דווקא המודל מסדר 0 יכליל יותר טוב. 

#### 4)

נחזור על הבחירה של סדר המודל בעזרת leave-one-out cross validation. במקרה זה אנו נחזור על החישוב של הסעיף הקודם 3 פעמים כשבכל פעם אנו בוחרים נקודה אחרת מה train set שתשמש כ validation set. את ביצועים של על אחד מהמודלים נחשב בתור הממוצע על שלושת החזרות.

##### סדר 0

<div class="imgbox">
<div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_0_fold_0.png)

</div><div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_0_fold_1.png)

</div><div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_0_fold_2.png)

</div>
</div>

- **Fold 1**: $\theta^*=3.5$. שיגאת חיזוי: $0.5$
- **Fold 2**: $\theta^*=4.5$. שיגאת חיזוי: $2.5$
- **Fold 3**: $\theta^*=3$. שיגאת חיזוי: $2$

שגיאת חיזוי ממוצעת: $5/3$

##### סדר ראשון

<div class="imgbox">
<div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_1_fold_0.png)

</div><div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_1_fold_1.png)

</div><div class="imgbox no-shadow" style="max-width:30%;display:inline-block;margin:0">

![](./output/ex_4_3_4_order_1_fold_2.png)

</div>
</div>

- **Fold 1**: $\boldsymbol{\theta}^*=[1, 1]^{\top}$. שיגאת חיזוי: $3$
- **Fold 2**: $\boldsymbol{\theta}^*=[7,-0.5]^{\top}$. שיגאת חיזוי: $4.5$
- **Fold 3**: $\boldsymbol{\theta}^*=[1.6,0.4]^{\top}$. שיגאת חיזוי: $1.8$

שגיאת חיזוי ממוצעת: $3.1$

באמת על פי leave-one-out נראה שוב כי המודל מסדר 0 הוא העדיף. מכיוון ששיטה זו לא מסתמכת על נקודה אחת לקביעת סדר המודל ישנו סיכוי טוב יותר שה hyper-parameters אשר נבחרים בשיטה זו יניבו מודל אשר מכליל בצורה טובה יותר
