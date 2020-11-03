---
type: lecture-slides
index: 2
template: slides
slides_pdf: true
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# הרצאה 2 - רגרסיה לינרארית

<div dir="ltr">
<a href="/assets/lecture02_slides.pdf" class="link-button" target="_blank">PDF</a>
</div>

</section><section>

## Supervised learing (למידה מונחית)

- בעיות supervised learning הם הבסיסיות ביותר בתחום והבנה טובה של בעיות אלו היא הבסיס להבנה של כל שאר הבעיות במערכות לומדות.

<div class="fragment">

- בקורס זה אנו נעסוק בעיקר בבעיות מסוג זה.

</div><div class="fragment">

- על מנת להבין מה הם בעיות supervised learning עלינו ראשית לחזור על הנושא של בעיות חיזוי.

</div>
</section><section>

## בעיית החיזוי

- בבעוית חיזוי אנו מנסים לחזות את ערכו של משתנה אקראי לא ידוע, לרוב על סמך משתנים אקראיים ידועים.

<div class="fragment">

- בעיות חיזוי הם **מאד** נפוצות ומופיעות במגוון רחב של תחומים בהנדסה ומדע.

- בהנדסת חשמל בעיות אלו מופיעות בתחומים כגון עיבוד אותות, תקשורת ספרתית ובקרה.

</div><div class="fragment">

- בעיות חיזוי מלוות אותנו כמעט בכל פעולה יום יומית. לדוגמא האם לקחת מטריה כשיוצאים מהבית.

</div><div class="fragment">

- ביום יום אנחנו לא מנסים לפתור את באופן מתמטי. אנו מחזיקים מודל של הקשרים הסטטיסטים ומשתמשים בו בצורה איכותית.

</div>
</section><section>

## הקשר ל supervised learning

- בבעיות חיזוי קלאסיות, אנו מניחים שהפילוג ידוע.

<div class="fragment">

- בsupervised learning (ובמערכות לומדות) אנו מניחים כי הפילוג אינו ידוע.

</div><div class="fragment">

- במקום הפילוג יש לנו מדגם.

</div><div class="fragment">

- את החזאי נאלץ כעת לבנות על סמך המדגם (במקום על סמך הפילוג).

</div>
</section><section>

## סימונים ושמות

- **Labels** (תויות / תגיות): $\text{y}$ - המשתנה האקראי שאותו אנו מנסים לחזות. (לרוב סקלר)

- **Observations \ measurements** (תצפיות או מדידיות): $\mathbf{x}$ - הוקטור האקראי אשר שעלפיו נרצה לבצע את החיזוי. (לרוב וקטור)

- $\hat{y}$ - תוצאת חיזוי.

- $\hat{y}=h(\boldsymbol{x})$ - פונקציית החיזוי.

- $D$ אורך של הוקטור $\boldsymbol{x}$

</section><section>

## The dataset (המדגם)

המדגם יהיה מורכב מזוגות של $\boldsymbol{x}$ ו $y$ אשר יוצרו מתוך $N$ דגימות **בלתי תלויות**:

$$
\mathcal{D}=\{\boldsymbol{x}^{(i)}, y^{(i)}\}_{i=1}^N
$$

$N$ - מספר הדגימות שבמדגם.

</section><section>

## Regression vs. Classification

מוקבל לחלק את הבעיות ב supervised learning לשני תתי תחומים:

<br/>

- **בעיות regression (רגרסיה)** - $\text{y}$ רציף.

<br/>

- **בעיות classification (סיווג)** - $\text{y}$ בדיד עם סט ערכים סופי (לרוב קטן).

</section><section>

## החזאי האופטימאלי

- כל פונקציה אשר ממפה מ $\boldsymbol{x}$ ל $y$ היא פונקציית חיזוי חוקית.

<div class="fragment">

- היינו מעוניינים למצוא חזאי אשר לעולם לא טועה.

</div><div class="fragment">

- מכיוון ש$\text{y}$ משתנה אקראי לא נוכל לחזותו במדוייק.

</div><div class="fragment">

- אנו צריכים להגדיר דרך להשוות בין הטעויות שאותם מבצעים החזאים שונים. (לדוגמא, הרבה טעויות קטנות או מעט גדולות)

</div>
</section><section>

## The cost function (פונקציית המחיר)

- פונקציית המחיר $C(h)$ מעניקה לכל חזאי ציון.

<div class="fragment">

- שהציון נמוך יותר=  חזאי טוב יותר.

</div><div class="fragment">

- החאי האופטימאלי $h^*$ הוא החזאי בעל הציון הנמוך ביותר:

$$
h^* = \underset{h}{\arg\min}C(h)
$$

</div><div class="fragment">

- פונקציית המחיר אמורה לשקף את המחיר אותו "נשלם" על שימוש בחזאי כל שהוא.

</div><div class="fragment">

- בפועל, משתמשים באחת מכמה פונקציות מחיר נפוצות.

</div>
</section><section>

## Risk and loss functions<br/>(פונקציות סיכון והפסד)

- פונקציית הcost מנסה לתת ציון ליכולת החיזוי הכללית של החזאי.

- פונקציית ה**loss** (הפסד) $l$ נותנת ציון לחיזוי בודד.

$$
l(h(\boldsymbol{x},y)=l(\hat{y},y)
$$

- ניתן להגדיר את פונקציית הcost כתוחלת על פונקציית loss:

$$
C(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
$$

- במקרים כאלה, מוקבל להשתמש בשם **risk** ובסימון:

$$
R(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
$$

</section><section>

## פונקציות loss (risk) נפוצות

#### Zero-one loss (misclassification rate):

  $$
  l(\hat{y},y)=I\{\hat{y}\neq y\}
  $$

  נפוצה בבעיות classificaiton.

<div class="fragment">

#### $l_2$ loss (mean squared error (MSE))

  $$
  l(\hat{y},y)=(\hat{y}-y)^2
  $$

  נפוצה בבעיות regression.<br/>
  בנוסף קיים גם root mean squared error (RMSE).

</div><div class="fragment">

#### $l_1$ loss (mean absolute error (MAE))

  $$
  l(\hat{y},y)=|\hat{y}-y|
  $$

  גם כן נפוצה בבעיות regression.

</div>
</section><section>

## הדוגמא מההרצאה הקודמת

<div class="imgbox">

![](../lecture01/output/drive_prediction.png)

</div>
</section><section>

## דוגמא - שמות ומשגים

- Labels - $\text{y}$ - <span class="fragment">זמן הנסיעה.</span>
- Meassurments - $\text{x}$ -  <span class="fragment">מספר המכוניות על הכביש.</span>
- $h$ -  <span class="fragment">פונקציית החיזוי: מספר המכוניות -> זמן הנסיעה.</span>
- $\mathcal{D}$ -  <span class="fragment">המדגם הנתון של הזוגות של (מספר מכוניות, זמן נסיעה).</span>
- בעיה זו הינה בעיית <span class="fragment">רגרסיה.</span>

<div class="fragment">

- נשתמש ב MSE כפונקציית ה risk\cost.

</div>
</section><section>

## דוגמא - בעיית האפוטימיזציה

$$
h^*
=\underset{h}{\arg\min}\mathbb{E}\left[(h(\mathbf{x})-\text{y})^2\right]
$$

<div class="fragment">

- לא נוכל לפתור את הבעיה באופן ישיר ישירות משום שהיא תלויה בתוחלת של פילוג לא ידוע.

</div><div class="fragment">

- נאלץ להציע בעיה אלטרנטיבית אשר תמזער את $C(h)$ על סמך המדגם.

</div>
</section><section>

## גישות לפתרון בעיות supervised learning

### גישה גנרטיבית (generative)

ננסה להשתמש במדגם על מנת ללמוד את הפילוג הלא ידוע.

<br/>
<br/>

##### גישה דיסקרימינטיבית (discriminative)

ננסה לבנות חזאי שטוב על המדגם, בתקווה שהוא יתן חיזויים טובים גם לדגימות מחוץ למדגם.

<br/>
<br/>
<br/>
<br/>

לכל אחד מהגישות יש את היתרונות והחסרונות שלה.

</section><section>

## תוחלת אמפירית

התוחלת האמפירית מקרבת את התוחלת האמיתית על ידי החלפת האינטגרל על הפילוג בסכימה על דגימות מהפילוג:

$$
\mathbb{E}\left[f(\text{x})\right]
\approx\hat{\mathbb{E}}_{\mathcal{D}}\left[f(x)\right]
=\frac{1}{N}\sum_{i=1}^Nf(x^{(i)})
$$

<br/>

כאשר מספר הדגימות $N$ הולך לאין סוף התוחלת האמפירית מתכנסת לתוחלת האמיתית במובן הסתברותי.

</section><section>

## Empirical risk minimization (ERM)

ERM משתמשת בתוחלת האמפירית על מנת להחליף את הrisk בrisk אמפירי:

$$
R(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
\approx\hat{R}(h)=\frac{1}{N}\sum_{i=1}^N\left[l(h(\boldsymbol{x}^{(i)}),y^{(i)})\right]
$$

בעיית האופטימיזציה תהיה:

$$
h^*_{\mathcal{D}}
=\underset{h}{\arg\min}\frac{1}{N}\sum_{i=1}^N\left[l(h(\boldsymbol{x}^{(i)}),y^{(i)})\right]
$$

</section><section>

## התלות במדגם

$$
h^*_{\mathcal{D}}
=\underset{h}{\arg\min}\frac{1}{N}\sum_{i=1}^N\left[l(h(\boldsymbol{x}^{(i)}),y^{(i)})\right]
$$

למה $h_{\mathcal{D}}^*$ לא $h^*$?

1. על מנת להדגיש את התלות של החזאי במדגם (לכל מדגם יהיה חזאי אופטימאלי אחר).

<div class="fragment">

2. בכדי להבדיל את החזאי של ERM מהחזאי האופטימאלי.

</div>
</section><section>

## האם החזאי ידע להכליל?

- לא מובטח שהפתרון של בעיית האופטימיזציה החדשה באמת יצליח להניב מחיר נמוך בפונקציית המחיר המקורית.
- האופטימיזציה היא על כל המרחב. זאת אומרת שניתן למצוא אין סוף פונקציות אשר מבצעות חיזוי מושלם.

</section><section>

## האם החזאי ידע להכליל?

<div class="imgbox no-shadow">

![](./assets/models_diagram_non_parametric.png)

</div>

</section><section>

## האם החזאי ידע להכליל?

- החזאי האופטימאלי לא בהכרח עובד דרך הנקודות שבמדגם. שהוא מנסה להיות אופטימאלי ביחס **לכל הדגימות האפשריות**
- חזאי הERM, מנסה מתעלמים מרוב הנקודות האפשריות ומתייחסים רק לאלו שבמקרה מופיעים במדגם.

<div class="fragment">

התוצאה: **overfitting**

</div>
</section><section>

## מודלים פרמטריים

- הגבלת המודל למשפחה מצומצמת של מודלים מסייעת למזער את הoverfitting.
- דרך נוחה להגיר משפחה של מודלים היא בעזרת מודל פרמטרי $h(\boldsymbol{x};\boldsymbol{\theta})$.
- המודל הפרמטרי מגדיר את צורת הפונקציה, עד כדי כמה פרמטרים שאותם יש לקבוע. לדוגמא:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\frac{\theta_1^3x_1+x_4^{\theta_2}}{\log(\theta_3x_2)}
$$

</section><section>

## מודלים פרמטריים - דוגמאות

1. פונקציות לינאריות: 

  $$
  h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 x_1+\theta_2 x_2+\theta_2 x_2
  $$
2. פולינומים:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 + \theta_2 x_1 + \theta_3 x_1^2 + \theta_4 x_1^3
$$

3. טור פוריה סופי:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 \sin(\pi x) + \theta_2 \cos(\pi x) + \theta_3 \sin(2\pi x) + \theta_4 \cos(2\pi x)
$$

4. רשתות נוירונים

</section><section>

## מודלים פרמטריים - מוטיבציה

שתי סיבות עיקריות לעבודה עם מודלים פרמטריים:

1. מגבילים את מרחב החיפוש ולכן יכולות לסייע במיזעור ה overfitting.
2. נוח לעבוד איתם. אנו ממפים כל פונקציה לוקטור, ועם וקטור קל לנו לעבוד.

<br/>
<br/>
<br/>

לדוגמא, נוכל להשתמש ב gradient decent על מנת לחפש את המודל האופטימאלי.

</section><section>

## אופטימיזציה על הפרמטרים

מיכוון שכל וקטור כעת מגדיר מודל מסויים (ולהיפך) ניתן לרשום את בעיית האופטימיזציה הפרמטרים (במקום על $h$):

$$
\boldsymbol{\theta}^* = \underset{\boldsymbol{\theta}}{\arg\min}C(h(\cdot;\boldsymbol{\theta}))
$$

או במקרה של ERM:

$$
\boldsymbol{\theta}^* = \underset{\boldsymbol{\theta}}{\arg\min}\frac{1}{N}\sum_{i=1}^N\left[l(h(\boldsymbol{x}_i;\boldsymbol{\theta}),y_i)\right]
$$

</section><section>

## מרחב המודלים

<div class="imgbox no-shadow">

![](./assets/models_diagram.png)

</div>

</section><section>

## מודל לינארי

מודל מהצורה:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 x_1+\theta_2 x_2+\dots+\theta_D x_D
$$

או בצורה וקטורית:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\boldsymbol{x}^{\top}\boldsymbol{\theta}
$$

</section><section>

## איבר היסט (bias)

ניתן להוסיף למודל גם איבר bias:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 + \boldsymbol{x}^{\top}[\theta_2, \theta_3, \dots, \theta_{D+1}]^{\top}
$$

בכדי לשמור על הכתיב הוקטורי נפריד את איבר ה bias משאר הפרמטרים:

$$
h(\boldsymbol{x};\boldsymbol{\theta},\theta_0)=\theta_0 + \boldsymbol{x}^{\top}\boldsymbol{\theta}
$$

לרוב נסמן אותו בעזרת $b$ או $\theta_0$:

<br/>
<br/>
<br/>

נראה דרך נוחה יותר להוספת איבר ההיסט בעזרת שינוי של הוקטור $\boldsymbol{x}$.

</section><section>

## Linear least squares

ERM + מודל לינארי + MSE:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2
$$

<br/>
<br/>
<br/>

בעיית הLLS נפוצה מאד ומופיעה בתחומים רבים.

</section><section>

## Linear least squares - כתיב מטריצי

נגדיר את הוקטור והמטריצה הבאים:

- וקטור התגיות:

  $$
  \boldsymbol{y}=[y^{(1)},y^{(2)},\cdot,y^{(n)}]^{\top}
  $$

- מטריצת המדידות:

  $$
  X=\begin{bmatrix}
  - & \boldsymbol{x}^{(1)} & - \\
  - & \boldsymbol{x}^{(2)} & - \\
  & \vdots & \\
  - & \boldsymbol{x}^{(N)} & -
  \end{bmatrix}
  $$

</section><section>

## Linear least squares - כתיב מטריצי

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

<br/>
<br/>
<br/>

בעזרת הגרות אלו, ניתן לרשום את בעיית האופטימיזציה של LLS באופן הבא:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
$$

</section><section>

## Linear least squares - פתרון סגור

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
$$

בבעיית האופטימיזציה הזו ניתן להגיע לפתרון סגור על ידי גזירה והשוואה ל-0:

$$
\nabla_{\theta}\left(\frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2\right)=0
$$

$$
\Rightarrow \boldsymbol{\theta} = (X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
$$

<br/>
<br/>

(את הפיתוח תראו בתרגול 3)

<br/>

פתרון זה נכון רק כאשר המטריצה $X^{\top}X$ הפיכה.

</section><section>

## בחזרה לדוגמא

<div class="imgbox" style="max-height:300px">

![](../lecture01/output/drive_prediction.png)

</div>

<br/>

נשתמש במודל:

  $$
  h(x;\theta)=\theta x
  $$

ונפתור בעזרת LLS.

</section><section>

## בחזרה לדוגמא

$$
h(x;\theta)=\theta x
$$

נחשת את $\theta$ על ידי:

$$
\theta^*_{\mathcal{D}}=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
$$

כאשר $X=[x^{(1)}, x^{(2)}, \dots, x^{(N)}]^{\top}$.

<br/>
התוצאה המקבלת הינה:

<div class="imgbox" style="max-height:300px">

![](../lecture01/output/drive_prediction_linear_no_bias.png)

</div>

</section><section>

## הוספת איבר היסט

נרצה להשתמש במודל מהצורה:

$$
h(x;\boldsymbol{\theta})=\theta_1 + \theta_2 x
$$

<br/>
<br/>

בעיה: הפתרון הסגור של LLS לא מתייחס למודל זה (עם bias).

<br/>
<br/>

פתרון: ננסח מחדש את הבעיה כך שיתקבל מודל ללא איבר היסט.

</section><section>

## שאלה

בדוגמא של חיזוי זמן הנסיעה, אילו מהפעולות הבאות שנעשה על $x$ (מספר המכוניות על הכביש) ימנע מאיתנו את היכולת לנסות ולפתור את בעיית החיזוי:

- החלפת יחידות (נגיד לספור את כמות המכוניות במאות).

<div class="fragment">

- הוספה של קבוע למספר המכוניות (נגיד +100).

</div><div class="fragment">

- העלאה של מספר המכוניות בריבוע.

</div>
</section><section>

## עיבוד מקדים

- אנו לא חייבים להשתמש בנתונים בצורתם הגולמית.
- מותר לנו לבצע עיבוד מקדים של הנתונים לפני שאנו מזינים אותם לחזאי.
- העיבוד המקדים יכול לפעול על כל וקטור המדידות $\boldsymbol{x}$, ולייצר וקטור חדש:

$$
\boldsymbol{x}_{\text{new}}=\Phi(\boldsymbol{x})
$$

פעולת החיזוי תהיה:

$$
\hat{y}=h(\Phi(\boldsymbol{x});\boldsymbol{\theta})
$$

</section><section>

## מאפיינים

את קלט החדש $\boldsymbol{x}_{\text{new}}$ מקובל לכנות וקטור ה**מאפיינים (features)**.

השימוש במאפיינים מאפשר דברים כגון:

- הרחבת מודלים פשוטים למודלים מורכבים יותר.
- החלפת האופן בשבו מיוצג המידע. לדוגמא:
  - החלפת יחידות.
  - הפיכת תמונת פנים לוקטור של מאפיינים כגון: המרחק בין העיניים, גוון העור, עד כמה הפנים אליפטיות וכו'
  - ניקוי רעשים בהקלטות audio.
- הפחתת overfitting (נראה לקראת סוף הקורס כשנדבר על הורדת מימד).

</section><section>

## פונקציות המאפיינים

אנו נשתמש לפעמים בסימון הבא:

$$
\Phi(\boldsymbol{x})=[\varphi_1(\boldsymbol{x}),\varphi_2(\boldsymbol{x}),\dots,\varphi_M(\boldsymbol{x})]^{\top}
$$

<br/>

כאן $\Phi$ הוא וקטור של פונקציות, כאשר כל פונקציה $\varphi_i$ אחראית על ייצור של איבר אחד בוקטור $\boldsymbol{x}_{\text{new}}$:

$$
x_{\text{new},i}=\varphi_i(\boldsymbol{x})
$$

</section><section>

## מודלים לינאריים ומאפיינים

על ידי שילוב של מודל לינארי עם מאפיינים נוכל לקבל חזאים מהצורה:

$$
\begin{aligned}
\hat{y}
&=h(\boldsymbol{x};\theta)
=h_{\text{linear}}(\Phi(\boldsymbol{x});\theta)
=\Phi(\boldsymbol{x})^{\top}\boldsymbol{\theta}\\
&=\theta_1 \varphi_1(\boldsymbol{x})+\theta_2 \varphi_2(\boldsymbol{x})+\dots+\theta_M \varphi_M(\boldsymbol{x})
\end{aligned}
$$

זאת אומרת מודל שהוא קומבינציה לינארית של פונקציות של $\boldsymbol{x}$.

<br/>
<br/>
<br/>

שימו לב: המודל נקרא מודל לינארי משום שהוא לינארי **בפרמטרים** שהם הנעלמים בבעיה (ולא ב $\boldsymbol{x}$)

</section><section>

## דוגמא: הוספה של איבר ההיסט

נוסיף כעת איבר היסט למודל שלנו לשיערוך זמן הנסיעה.

נעשה זאת על ידי שימוש במאפיינים הבאים:

$$
\varphi_1(x)=1,\quad\varphi_2(x)=x
$$

כל דגימה $x$ תהפוך לוקטור $x_{\text{new}}=[1, x]^{\top}$ ומודל החיזוי שלנו יהיה:

$$
h(x;\boldsymbol{\theta})=\theta_1 + \theta_2 x
$$

המטריצת המדידיות $X$ תהיה כעת:

$$
X=\begin{bmatrix}
1 & x^{(1)} \\
1 & x^{(2)} \\
\vdots & \vdots\\
1 & x^{(N)}
\end{bmatrix}
$$

</section><section>

## דוגמא: הוספה של איבר ההיסט

הצבה של מטריצה זו בנוחסא ל $\boldsymbol{\theta}^*_{\mathcal{D}}$ נותנת את המודל הלינארי הבא:

<div class="imgbox" style="max-height:400px">

![](../lecture01/output/drive_prediction_linear.png)

</div>
</section><section>

## מה קורה כשאין פתרון סגור?

בניגוד למקרה של LLS, לרוב לא יהיה לבעיה פתרון סגור.

לדוגמא, נניח ואנו רוצים לנסות להשתמש במודל מהצורה:

$$
h(x;\boldsymbol{\theta})=\theta_1-\theta_2 \exp(-x/\theta_3)
$$

<div class="imgbox" style="max-height:300px">

![](../lecture01/output/drive_prediction.png)

</div>
</section><section>

## אין פתרון סגור - דוגמא

$$
h(x;\boldsymbol{\theta})=\theta_1-\theta_2 \exp(-x/\theta_3)
$$

נשתמש ב RMSE ו ERM ונקבל את בעיית האופטימיזציה הבאה:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \sqrt{\frac{1}{N}\sum_{i=0}^N(\theta_1-\theta_2 \exp(-x/\theta_3)-y_i)^2}
$$

<br/>
<br/>
<br/>

ניתן כמובן להיפתר מהשורש ומה $\frac{1}{N}$ מבלי לשנות את בעיית האופטימיזציה:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \underbrace{\sum_{i=0}^N(\theta_1-\theta_2 \exp(-x/\theta_3)-y_i)^2}_{f(\boldsymbol{\theta};\mathcal{D})}
$$

</section><section>

## אין פתרון סגור - דוגמא

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \underbrace{\sum_{i=0}^N(\theta_1-\theta_2 \exp(-x/\theta_3)-y_i)^2}_{f(\boldsymbol{\theta};\mathcal{D})}
$$

- לבעיה זו אין פתרון סגור, נצטרך למצוא דרך חליפית לפתור אותה

</section><section>

## Gradient descent (אלגוריתם הגרדיאנט)

Gradient descent מנסה למצוא מינימום לוקאלי על ידי בכיוון שבו הפונקציה יורדת הכי מהר.

<div class="imgbox" style="max-height:400px">

![](../lecture02/assets/sled.jpg)

</div>

</section><section>

## Gradient descent (אלגוריתם הגרדיאנט)

הדרישה היחידה על הינה היכולת לחשב את הנגזרת של פונקציית המטרה. בהינתן הנגזרת שלבי האלגוריתם הם כדלקמן:

- מאתחלים את הפרמטרים לערך התחלתי כל שהוא: $\boldsymbol{\theta}^{(0)}$
- חוזרים על צעד העדכון הבא עד להתכנסות:

  $$
  \boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta \nabla_{\boldsymbol{\theta}}f(\boldsymbol{\theta}^{(t)})
  $$

הפרמטר $\eta$ אשר קובע את גודל הצעדים.

</section><section>

## Gradient descent - ארגוליתם חמדן

$$
\boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta \nabla_{\boldsymbol{\theta}}f(\boldsymbol{\theta}^{(t)})
$$

לאלגוריתמים אטרטיביים אשר מנסים בכל איטרציה לשפר את מצבם לעומת המצב הנוכחי (מבלי התייחס צורה הגלובאלית של הפונקציה) אנו קוראים אלגוריתמים חמדנים (greedy).

<br/>
<br/>

כפי שציינו קודם אלגוריתמים כאלה לא מתיימרים להתכנס לאפטימום הגלובאלי.

</section><section>

## Gradient descent - דוגמא

לדוגמא, בבעיה שלנו הגרדיאנט יהיה:

$$
\nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta};\mathcal{D})
=2\sum_{i=0}^N(\theta_1-\theta_2 \exp(-\theta_3 x)-y_i)\begin{bmatrix}
1\\
-\exp(-x/\theta_3)\\
-x\theta_2/\theta_3^2 \exp(-x/\theta_3)
\end{bmatrix}
$$

בעובר $\boldsymbol{\theta}^{(0)}=[1,1,1]^{\top}$ (ו $\eta=0.1$) מקבלים את הפתרון הבא:

<br/>

<div class="imgbox" style="max-height:300px">

![](../lecture01/output/fitting_exp_model.gif)

</div>

</section><section>

## Gradient descent - בעיות

<div class="imgbox" style="max-height:300px">

![](../lecture01/output/fitting_exp_model.gif)

</div>

<br/>
<br/>

Gradient descent הוא אומנם פשוט מאד לשימוש אך בפועל מאד קשה לגרום לו להתכנס בזמן סביר.

<br/>

אנו נדון בהמשך הקורס בבעיות של אלגוריתם זה וכיצד ניתן להתמודד איתן.

</section>
</div>
