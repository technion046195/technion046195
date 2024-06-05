---
type: lecture-slides
index: 3
template: slides
slides_pdf: true
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# הרצאה 3<br/>Generalization & overfitting

<div dir="ltr">
<a href="/assets/lecture03_slides.pdf" class="link-button" target="_blank">PDF</a>
</div>

</section><section>

## מה נלמד היום

<div class="imgbox" style="max-width:900px">

![](./assets/course_diagram.png)

</div>

</section><section>

## LLS בעבור פולינומים מסדרים שונים

<div style="direction:ltr;
            text-align:center;
            align-items: center;
            display:grid;
            grid-template-columns: 1fr 1fr">
<div class="imgbox" style="width:450px" >

![](../lecture01/output/linear.png)

</div><div class="imgbox" style="width:450px">

![](../lecture01/output/poly_2.png)

</div><div class="imgbox" style="width:450px">

![](../lecture01/output/poly_4.png)

</div><div class="imgbox" style="width:450px">

![](../lecture01/output/poly_15.png)

</div></div>
</section><section>

## הכללה (generalization)

> בעיית הלמידה בתחום של מערכות לומדות היא בעיית הכללה, שבה אנו מנסים על סמך דוגמאות להסיק מסקנות לגבי ההתנהגות הכללית של המערכת.

לדוגמא בבעיות supervised learning מטרה שלנו היא לבנות חזאי אשר יוכל לבצע חיזויים טובים על דגימות שלא ראינו לפני.

</section><section>

## הערכת הביצועים / יכולת ההכללה של חזאי

- נרצה להעריך את יכולת ההכללה של החזאי שבנינו על דגימות שלא הופיעו בשלב הלימוד.
- נצטרך מדגם נוסף המכיל דגימות שונות מהמדגם שבו השתמשנו בשלב הלימוד.
- נקצה חלק מתוך המדגם לטובת הערכת הביצועים.

נחלק את המדגם שלנו לשני חלקים:

- **Train set** - $\mathcal{D}_\text{train}$ - המדגם שעל פיו אנו נבנה את חזאי.
- **Test set** - $\mathcal{D}_\text{test}$ - המדגם שבו נשתמש להעריכת ביצועים.

</section><section>

## הערכת הביצועים של פונקציית risk

כאשר פונקציית המחיר שלנו היא מהצורה של פונקציית risk, הערכת הביצועים תעשה בעזרת תוחלת אמפירית על ה test set:

$$
\text{test cost}=\frac{1}{N_{\text{test}}}\sum_{\boldsymbol{x}^{(i)},y^{(i)}\in\mathcal{D}_{\text{test}}} l(h(\boldsymbol{x}^{(i)}),y^{(i)})
$$

</section><section>

## גודלו של ה test set

- אנו נרצה שיהיה גדול מספיק בכדי שההערכה תהיה מדוייקת.
- לא גדול מדי, בכדי לשמור את ה train set כמה שיותר גדול.
- כאשר המדגם לא מאד גדול מקובל לפצל את המדגם ל<br>80% train ו 20% test.

</section><section>

## דוגמא: פיצול train-test

<div class="imgbox" style="max-width:600px">

![](./output/drive_prediction_train_test.png)

</div>

</section><section>

## דוגמא: הערכת ביצועים

<div class="imgbox" style="max-width:600px">

![](./output/drive_prediction_linear.png)

</div>

- Train cost (RMSE): 11.34 min
- Test cost (RMSE): 15.58 min

</section><section>

## התלות בסדר הפולינום

<div class="imgbox" style="max-width:900px;direction:ltr">
<div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_0_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_1_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_2_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_3_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_4_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_5_train_test.png)

</div>
</div>

<div class="imgbox" style="max-width:900px;direction:ltr">
<div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_6_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_7_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_8_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_9_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_10_train_test.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_11_train_test.png)

</div>
</div>

<div class="imgbox" style="max-width:450px">

![](./output/drive_prediction_train_test.png)

</div>

</section><section>

## Overfitting (התאמת יתר)

> תופעת ה overfitting מתארת את המצב שבו המודל הנלמד לומד מאפיינים מסויימים אשר מופיעים רק במדגם ואינם הם אינם מייצגים את התכונות של הפילוג האמיתי שלפיו מפולגים המשתנים האקראיים אשר מהם נוצר המדגם במדגם. תופעה זו פוגעת ביכולת ההכללה של המודל.

<div class="imgbox" style="max-width:350px;background-color:white">

![](./assets/overfitting.png)

</div>

</section><section>

## Overfitting (התאמת יתר)

<div class="imgbox" style="max-width:600px;background-color:white">

![](../lecture02/assets/models_diagram_non_parametric.png)

</div>

</section><section>

## הגבלת המודל

- חזאי לא מוגבל יכול לקבל כל צורה כל עוד הוא עובר בין הנקודות של המדגם.
- בכדי לשלוט בצורה שבה הוא מתנהג נוכל להגביל את המרחב שבו אנו מחפשים.
- נעשה זאת על ידי שימוש במודל פרמטרי.

נסמן:

- $h(\boldsymbol{x};\boldsymbol{\theta}^*)$: החזאי ה**פרמטרי** האופטימאלי.

- $h_{\mathcal{D}}(\boldsymbol{x};\boldsymbol{\theta}^*)$: החזאי המשערך.

</section><section>

## הגבלת המודל

<div class="imgbox" style="max-width:600px;background-color:white">

![](../lecture02/assets/models_diagram.png)

</div>

</section><section>

## יכולת הביטוי של מודל פרמטרי

**יכולת הביטוי (expressiveness)** של מודל מתייחסת לגודל של מרחב הפונקציות שאותו יכול המודל פרמטרי מסויים לייצג.

- **יכולת ביטוי נמוכה** -> יודע לייצג משפחה מצומצמת. לדוגמא: מודל לינארי.
- **יכולת ביטוי גבוהה** -> יודע לייצג **או לקרב** משפחה רחבה. לדוגמא: פולינום מסדר גבוהה.

<div class="fragment">

איזה יכולת ביטוי נעדיף?

</div>
<div class="fragment">

- מצד אחד אנו נרצה מודל עם יכולת ביטוי גבוהה על מנת שיוכל לקרב את החזאי האידאלי.
- מצד שני יכולת יצוג גבוה תאפשר הרבה overfitting.

</div>
</section><section>

## Hyper-parameters

Hyper parameters הינו שם כולל לכל הפרמטרים שמופיעים בשיטה או במודל הפרמטרי, אך הם אינם חלק ממשתני האופטימיזציה בשלב האופטימיזציה על ה train-set.

<br/>

דוגמאות:

- סדר הפולינום שבו אנו משתמשים.
- הפרמטר $\eta$ אשר קובע את גודל הצעד באלגוריתם ה gradient descent.
- פרמטרים אשר קובעים את המבנה של רשת נוירונים.

</section><section>

## סדר המודל

<br/>
<br/>
<br/>

כאשר hyper-parameter מסויים שולט ביכולת הביטוי של המודל הפרמטרי, כדוגמאת המקרה של סדר הפולינום, נכנה פרמטר זה **הסדר של המודל**.

</section><section>

## בחירת hyper-parameters <br/> בעזרת validation set

- hyper-parameters אינם חלק מבעיית האופטימיזציה.
- אנו צריכים דרך אחרת לקבוע אותם.
- לרוב נאלץ לקבוע אותם בעזרת ניסוי וטעיה.
- לא נוכל להשתמש ב test set לצורך זה.
- נצטרך לייצר מדגם נפרד חדש.
- נפצל עוד את ה train set ל:
  - train set חדש.
  - validation set.

</section><section>

## שלבי הבחירה של hyper-prameters

- נפצל את ה train set ל train ו validation.
- נחזור על הפעולות הבאות בעבור ערכים שונים של<br>ה hyper-parameters:
  - נבנה את המודל על סמך ה train.
  - נשערך את ביצועי המודל על הvalidation.
- נבחר את הפרמטרים עם הביצועים הטובים ביותר על ה validation.
- נאחד בחזרה את ה train וה validation.
- נבנה את המודל הסופי על סמך ה hyper-parameters שנבחרו.

</section><section>

## דוגמא: פיצול train-validation-test

<div class="imgbox" style="max-width:600px">

![](./output/drive_prediction_train_val_test.png)

</div>

</section><section>

## התלות בסדר הפולינום

<div class="imgbox" style="max-width:900px;direction:ltr">
<div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_0.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_1.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_2.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_3.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_4.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_5.png)

</div>
</div>

<div class="imgbox" style="max-width:900px;direction:ltr">
<div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_6.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_7.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_8.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_9.png)

</div><div class="imgbox no-shadow" style="max-width:150px;display:inline-block;margin:0">

![](./output/drive_prediction_k_10.png)

</div>
</div>

<div class="imgbox" style="max-width:450px">

![](./output/drive_prediction_selecting_order.png)

</div>

</section><section>

## דוגמא: Retrain

<div class="imgbox" style="max-width:600px">

![](../lecture01/output/poly_3.png)

</div>

- Train cost (RMSE): 2.53 min
- Test cost (RMSE): 6.88 min

</section><section>

## Approximation-estimation decomposition

נתייחס לשני גורמים אשר מונעים מאיתנו למצוא את החזאי האופטימאלי $h^*(\boldsymbol{x})$:

<br/>

**Approximation error - שגיאת קירוב**

השגיאה עקב ההגבלה למשפחה פרמטרית מסויימת.

נובעת מההבדל בין $h^*(\boldsymbol{x})$ לבין $h^*(\boldsymbol{x},\boldsymbol{\theta})$.

<br/>

**Estimation error - שגיאת השיערוך**

השגיאה הנובעת מהשימוש במדגם כתחליף לפילוג האמיתי.

נובעת מההבדל בין $h^*(\boldsymbol{x},\boldsymbol{\theta})$ לבין $h_{\mathcal{D}}^*(\boldsymbol{x},\boldsymbol{\theta})$.

</section><section>

## Aprroxiamtion-estimation decomposition

<div class="imgbox" style="max-width:700px;background-color:white">

![](./assets/models_diagram_approx_estim_decomp.png)

</div>

</section><section>

## Noise error

כאשר נרצה לדבר על השגיאה הכוללת נרצה להתייחס להבדל בין החיזוי של החזאי המשוערך $h^*_{\mathcal{D}}(\boldsymbol{x};\boldsymbol{\theta})$ ו $y$.

<br/>

במקרים אלו נוסיף גורם שלישי:

<br/>
<br/>

**Noise - ה"רעש" של התויות**

השגיאה שהחזאי האופטימאלי צפוי לעשות.

שגיאה זו נובעת מהאקראיות של התויות $y$.

</section><section>

## Approximation-estimation Tradeoff

- ככל שיכולת הביטוי תגדל המרחק בין $h^*(\boldsymbol{x};\boldsymbol{\theta})$ לבין $h^*(\boldsymbol{x})$ יקטן ושגיאת הקירוב תקטן.

- בלא מעט מקרים ככל שיכולת הביטוי תגדל גם שגיאת השיערוך תגדל.

<div class="imgbox" style="max-width:600px;background-color:white">

![](./assets/approx_estim_tradeoff.png)

</div>

</section><section>

## המדגם כמשתנה אקראי

- ביצועיו של חזאי כל שהוא תלויים לא רק בשיטה ובמודל הפרמטרי אלא גם במדגם שאיתו עבדנו.
- בעבור מדגמים שונים אנו מצפים לקבל ביצועים שונים.
- ניתן להסתכל על המדגם כמשתנה אקראי.
- בכדי לבטל את התלות במדגם נמצע את הביצועים על פני כל המדגמים האפשריים.

$$
\text{average cost}=\mathbb{E}_{\mathcal{D}}\left[R(h_{\mathcal{D}})\right]
$$

כאשר $\mathbb{E}_\mathcal{D}$ היא התוחלת על פני המדגמים האפשריים

</section><section>

## החזאי הממוצע

לצורך הדיון התיאורטי על מרכיבי שגיאת החיזוי נגדיר את החזאי הממוצע באופן הבא:

<br/>

החזאי אשר מחזיר את החיזוי הממוצע על פני כלל החזאים המתאימים למדגמים השונים:

$$
\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)\right]
$$

גודל זה אינו ניתן לחישוב! 

</section><section>

## Bias-variance decomposition

- פירוק יותר פרקטי.
- מתאים לפונקציית מחיר של MSE.

$$
\begin{aligned}
&\mathbb{E}_{\mathcal{D}}\left[
    \mathbb{E}\biggl[(h_{\mathcal{D}}(\text{x})-y)^2\right]
\right]\\
&\qquad=
\mathbb{E}\left[
    \underbrace{\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)\right])^2\right]}_{\text{Variance}}
    +\underbrace{(\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)\right]-h^*(\text{x}))^2}_{\text{Bias}^2}\\
    &\qquad+ \underbrace{(h^*(\text{x})-y)^2}_{\text{Noise}}\biggr]
\end{aligned}
$$

כאשר

- $h^*(x)=\mathbb{E}\left[\text{y}|x\right]$.

</section><section>

## Bias-variance decomposition

$$
\begin{aligned}
&\mathbb{E}_{\mathcal{D}}\left[
    \mathbb{E}\biggl[(h_{\mathcal{D}}(\text{x})-y)^2\right]
\right]\\
&\qquad=
\mathbb{E}\left[
    \underbrace{\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\text{x})-\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)\right])^2\right]}_{\text{Variance}}
    +\underbrace{(\mathbb{E}_{\mathcal{D}}\left[h_{\mathcal{D}}(x)\right]-h^*(\text{x}))^2}_{\text{Bias}^2}\\
    &\qquad+\underbrace{(h^*(\text{x})-y)^2}_{\text{Noise}}
\biggr]
\end{aligned}
$$

<div class="imgbox" style="max-width:500px;background-color:white">

![](./assets/bias_variance_tradeoff.png)

</div>

</section><section>

## רגולריזציה

- דרך אלטרנטיבית להקטין את שגיאת השיערוך / variance.
- הרעיון: להתערב בבעית האופטימיזציה על מנת לגרום לה "להעדיף" מודלים מסויימים.
- זוהי הגבלה "רכה" של משפחת המודלים.
- מאפשר שימוש במודלים פרמטרים בעלי יכולת ביטוי גבוהה יותר.

</section><section>

## רגולריזציה

השיטה: נוסיף איבר אשר יתן "קנס" למודלים לא רצויים.

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\underbrace{f(\boldsymbol{\theta})}_{\text{The regular objective function}}+\lambda\underbrace{g(\boldsymbol{\theta})}_{\text{The regularization term}}
$$

הפרמטר $\lambda$ קובע את עוצמת (או משקל) הרגולריזציה.

הוא hyper-parameter שיש לקבוע בעזרת ה validation set.

</section><section>

## רגולריזציה - אילוסטרציה

<div class="imgbox" style="max-width:800px;background-color:white">

![](./assets/models_diagram_regularization.png)

</div>

</section><section>

## בחירת הרגולריזציה

- באופן כללי, הבחירה של פונקציית הרגולריזציה $g(\theta)$ תלויה באופי הבעיה.
- לרוב הבחירה תהיה בשיטה של ניסוי וטעיה על פונקציות רגולריזציה נפוצות.
- פונקציות הרגולריזציה הנפוצות ביותר הינן:
  - $l_1$ - מוסיף $g(\boldsymbol{\theta})=\lVert\boldsymbol{\theta}\rVert_1$.
  - $l_2$ - מוסיף $g(\boldsymbol{\theta})=\lVert\boldsymbol{\theta}\rVert_2^2$.

רגולריזציית $l_2$ מכונה גם Tikhonov regularizaion

</section><section>

## $l_1$ ו $l_2$ הדומה

- מנסות לשמור את הפרמטרים כמה שיותר קטנים.
- מוטיבציה: מודל בעל פרמטרים קטנים יותר יהיה לרוב בעל נגזרות קטונות יותר, ולכן הוא יהיה יותר "חלק".

</section><section>

## $l_1$ ו $l_2$ השונה

### $l_2$

- גדל בצורה ריבועית עם הפרמטרים
- ינסה להקטין בעיקר את הפרמטרים הגדולים ופחות את הקטנים.
- הרגולריזציה שואפת לפרמטרים בעלי גודל יותר אחיד.

</section><section>

## $l_1$ ו $l_2$ השונה

### $l_1$

- תפעל להקטין את כל האיברים כמה שיותר ללא קשר לגודלם.
- רגולריזציית $l_1$ תגרום לפרמטרים הפחות חשובים להתאפס.
- וקטור הפרמטרים שיתקבל יכיל הרבה מאד אפסים - וקטור דליל (sparse).

</section><section>

## Ridge regression: LLS + $l2$ regularization

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_i(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2+\lambda\lVert\boldsymbol{\theta}\rVert_2^2
$$

גם לבעיה זו יש פתרון סגור והוא נתון על ידי:

$$
\boldsymbol{\theta}^*=(X^{\top}X+\lambda)^{-1}X^{\top}\boldsymbol{y}
$$

אנו נראה את הפתוח של פתרון זה בתרגיל 4.2.

</section><section>

## LASSO: LLS + $l1$ regularization

$$
\boldsymbol{\theta}=\underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_i(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2+\lambda\lVert\boldsymbol{\theta}\rVert_1
$$

לבעיה זו אין פתרון סגור ויש צורך להשתמש באלגוריתמים איטרטיביים אשר מבוססים על gradient descent.

<br/>
<br/>
<br/>

LASSO = Linear Absolute Shrinkage and Selection Operator

</section><section>

## דוגמא: Ridge regression

<div class="imgbox" style="max-width:600px">

![](../lecture01/output/poly_10.png)

</div>

- $\lambda=10^{-4}$
- Train cost (RMSE): 2.62 min
- Test cost (RMSE): 6.83 min

</section>
</div>
