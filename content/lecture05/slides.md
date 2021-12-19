---
type: lecture-slides
index: 5
template: slides
slides_pdf: false
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# הרצאה 5 - Bagging and Boosting

<div dir="ltr">
<a href="/assets/lecture05_slides.pdf" class="link-button" target="_blank">PDF</a>
</div>

</section><section>

## מה נלמד היום

<div class="imgbox" style="max-width:900px">

![](./assets/course_diagram.png)

</div>
</section><section>

## Ensembles Methods

בהרצאה הזו נציג שתי שיטות אשר בעזרתם ניתן לשפר את הביצועים של אלגוריתמים קיימים על ידי שימוש בסט של חזאים. סט זה מכוונה לרוב ensemble (מכלול).

</section><section>

## תזכורת Bias and Variance

- מתייחסים לפילוג של שגיאת החיזוי **על פני מדגמים שונים**.
- נתייחס למדגם כאל משתנה אקראי.

<div class="imgbox" style="max-width:800px">

![](../lecture05/assets/models_bias_variance.png)

</div>

</section><section>

## תזכורת Bias and Variance

<div class="imgbox" style="max-width:600px">

![](../lecture05/assets/models_bias_variance.png)

</div>

- החיזוי הממוצע: $\bar{h}(\boldsymbol{x})=\mathbb{E}_{\mathcal{D}}\left[h(\boldsymbol{x})\right]$ 
- החזיזוי האופטימאלי $h^*(\boldsymbol{x})$.
- ה bias  הוא ההפרש בין החיזוי הממוצע לחיזוי האופטמאלי.
- ה variance הוא ה $\mathbb{E}_{\mathcal{D}}\left[(h_{\mathcal{D}}(\boldsymbol{x})-\bar{h}(\boldsymbol{x}))^2\right] $

</section><section>

## תזכורת Bias and Variance

- מודלים בעלי יכולת ייצוג נמוכה יסבלו לרוב מ underfitting אשר יתבטא ב bias גבוה ו variance נמוך
- מודלים בעלי יכולת ייצוג גבוהה יסבלו לרוב מ overfitting אשר יתבטא ב variance מאד גבוה ו bias נמוך

</section><section>

## Bagging ו Boosting

כעת נוכל להסביר מה bagging ו boosting מנסים לעשות:

- ב bagging ננסה לקחת מכלול של חזאים עם variance גבוהה ולשלב בניהם בכדי ליצור חזאי עם variance נמוך יותר.
- ב boosting ננסה לקחת מכלול של חזאים עם bias גבוהה ולשלב בניהם בכדי ליצור חזאי עם bias נמוך יותר.

</section><section>

## Bagging

נהיה מעוניינים לייצר מכלול (ensamble) של חזאים בעלי bias נמוך אך variance גבוה ואז לשלב בניהם על מנת להקטין את ה variance.

<br/>

אחת הבחירות הנפוצות לחזאים שכאלה ב bagging היא עצי החלטה עמוקים (ללא pruning).

<br/>

השם Bagging הוא הלחם של המילים **bootstrapping** ו **aggregation**, שהם שני שלבי השיטה.

</section><section>

## גישה נאיבית

- אם היינו יכולים לייצר כמה מדגמים בלתי תלויים, היינו יכולים לבנות חזאי בעבור כל מדגם ולמצע על החזאים על מנת להקטין את ה variance של השגיאת החיזוי.

- בפועל לרוב יהיה בידינו רק מדגם יחיד שאיתו נצטרך לעבוד.

- ניתן לייצר מספר מדגמים על ידי חלוקת המדגם הקיים, אך לרוב העובדה שהמדגמים הם משמעותית קטנים מהמדגם המקורי **תגדיל** את ה vairance.

</section><section>

## Bootstrapping

אופציה חלופית אשר שומרת על גודל המדגם, אך מתפשרת על דרישת החוסר תלות בין המדגמים ובין הדגימות.

<br/>

<div class="imgbox" style="max-width:800px">

![](../lecture05/assets/bootstrapping.png)

</div>

</section><section>

## Bootstrapping

<div class="imgbox" style="max-width:800px">

![](../lecture05/assets/bootstrapping.png)

</div>

בשיטה זו אנו נייצר מדגמים חדשים על ידי דגימה מחדש של המדגם הנתון. הדגימה הינה **עם חזרות**.

</section><section>

## Bootstrapping

- הסיכוי של דגימה כל שהיא להופיע ב $\tilde{\mathcal{D}}$ הינה $1-(1-\frac{1}{N})^{\tilde{N}}$.
- כאשר $\tilde{N}=N$ ו $N\rightarrow\infty$, סיכוי זה הולך ל $1-e^{-1}\approx63\%$.

</section><section>

## Aggregation: שילוב חזאים לחזאי יחיד

<div class="imgbox" style="max-width:600px">

![](../lecture05/assets/bagging.png)

</div>

- נייצר $M$ מדגמים חדשים בגדול זהה למדגם המקורי $\tilde{N}=N$.
- בעבור כל אחד מהמדגים $\tilde{\mathcal{D}}_m$ נבנה חזאי $\tilde{h}_m$.
- נקבץ את כל החזאים על מנת לקבל את החזאי הכולל.

</section><section>

## Aggregation: שילוב חזאים לחזאי יחיד

<div class="imgbox" style="max-width:500px">

![](../lecture05/assets/bagging.png)

</div>

- **בעבור בעיות רגרסיה**: אנו נמצע את תוצאת החיזוי של כל החזאים: $h(\boldsymbol{x})=\frac{1}{M}\sum_{m=1}^M \tilde{h}_m(\boldsymbol{x})$
- **בעבור בעיות סיווג**: נבצע majority voting, זאת אומרת: $h(\boldsymbol{x})=\text{majority}(\{\tilde{h}_1(\boldsymbol{x}),\tilde{h}_2(\boldsymbol{x}),\dots,\tilde{h}_M(\boldsymbol{x})\})$

</section><section>

## Aggregation: שילוב חזאים לחזאי יחיד

<div class="imgbox" style="max-width:500px">

![](../lecture05/assets/bagging.png)

</div>

- מספר המדגמים $M$ נע בין עשרות מדגמים לאלפים.
- לרוב נשתמש באותה השיטה על מנת לבנות את כל החזאים.

</section><section>

## Out Of Bag Error Estimation (לקריאה עצמית - לא למבחן)

- ניתן להעריך את ביצועי המודל ללא צורך ב test / validation set.
- הרעיון הינו להשתמש בעובדה שכל אחד מהמדגמים מכיל רק חלק מהדגימות.

</section><section>

## Random Forest (לקריאה עצמית - לא למבחן)

- שילוב של עצי החלטה עם bagging + תוספת.
- שיטה מאד יעילה ונפוצה.

</section><section>

## Boosting

- ננסה להשתמש במכלול של חזאים בעלי **bias גבוהה** אך **variance נמוך** בכדי ליצור חזאי כולל בעל bias נמוך.
- שיטות אלו מתמקדות בבעיות סיווג בינארי.
- התווית בבעיה הם $\text{y}=\pm1$.

</section><section>

## בעיית ה boosting המקורית<br/>(לקריאה עצמאית - לא למבחן)

- מהו **לומד חזק**?
- מהו **לומד חלש**?
- האם כל לומד  הוא בעצם גם לומד חזק?

</section><section>

## AdaBoost (adaptive-boosting)

בהינתן אוסף של חזאים $\tilde{h}(\boldsymbol{x})$ בעלי bias גובה, שיטה זו מנסה לבנות חזאי מהצורה של:

$$
h(\boldsymbol{x})=\text{sign}\left(\sum_{m=1}^M\alpha_m \tilde{h}_m(\boldsymbol{x})\right)
$$

כך ש $h(\boldsymbol{x})$ יהיה בעל bias נמוך.

- בחירה פופולרית של מסווגים כאלה הינה עצי החלטה בעומק 1 המוכנים **stumps** (עצים עם פיצול יחיד).

</section><section>

## החסם על ה misclassification rate

נראה שבעבור חזאי מהצורה של

$$
h(\boldsymbol{x})=\text{sign}\left(\sum_{m=1}^M\alpha_m \tilde{h}_m(\boldsymbol{x})\right)
$$

<br/>

ה misclassification rate חסום מלמעלה על ידי:

$$
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

</section><section>

## החסם על ה misclassification rate

נתחיל בעובדה שבעבור $y=\pm1$ וערך כל שהוא $z$ מתקיים ש:

$$
I\{\text{sign}(z)\neq y\}=
I\{\text{sign}(yz)\neq 1\} \leq
\exp(-yz)
$$

ונשתמש באי השיוון הנ"ל על כל איבר בסכום סנוסחא ל misclassifiaction rate ונקבל כי:

$$
\begin{aligned}
\frac{1}{N}\sum_i I\{h(\boldsymbol{x}^{(i)})\neq y^{(i)}\}
&=\frac{1}{N}\sum_i I\left\lbrace\text{sign}\left(\sum_{m=1}^M\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)\neq y^{(i)}\right\rbrace\\
&\leq\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M y^{(i)}\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
\end{aligned}
$$

</section><section>

## בעיית האופטימיזציה של AdaBoost

על פי החסם שהצגנו לעיל נוכל להניח כי מזעור של בעיית האופטימיזציה הבאה:

$$
\underset{\{\alpha_m,\tilde{h}_m\}_{m=1}^M}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

תגרום כנראה להקטנת ה misclassification rate ובכך להקטנת ה bias.

- אנו נראה בהמשך כי תחת תנאים מסויימים שכאשר $M\rightarrow\infty$ החסם ילך ל-0.

</section><section>

## בעיית האופטימיזציה של AdaBoost

$$
\underset{\{\alpha_m,\tilde{h}_m\}_{m=1}^M}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

- AdaBoost מנסה לפתור את בעיית האופטימיזציה בצורה חמדנית.
- אנו נגדיל את $M$ בהדרגה כאשר בכל פעם נחפש את ה $\alpha_m$ וה $\tilde{h}_m$ האופטימאלים.

</section><section>

## בעיית האופטימיזציה של AdaBoost

$$
\underset{\{\alpha_m,\tilde{h}_m\}_{m=1}^M}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

נסתכל על המצב בו כבר מצאנו את כל ה $\alpha_m$ וה $\tilde{h}_m$ עד ל $M-1$, וכעת אנו רוצים למצוא את $\alpha_M$ ו $\tilde{h}_M$:

$$
\alpha_M,\tilde{h}_M=\underset{\alpha,\tilde{h}}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^{M-1}\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})-\alpha y^{(i)}\tilde{h}(\boldsymbol{x}^{(i)})\right)
$$

- $\alpha_M$ יכול לקבל כל ערך.
- את $\tilde{h}_M$ עלינו לבחור מתוך מאגר מסווגים נתון.

</section><section>

## בעיית האופטימיזציה של AdaBoost

$$
\alpha_M,\tilde{h}_M=\underset{\alpha,\tilde{h}}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^{M-1}\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})-\alpha y^{(i)}\tilde{h}(\boldsymbol{x}^{(i)})\right)
$$

הדרך לפתור את בעיית האופטימיזציה:

1. רישום מחדש של בעיית האופטימיזציה בצורה יותר פשוטה.
2. מציאת $\alpha_M$ כפונקציה של $\tilde{h}_M$ על ידי גזירה והשוואה ל-0.
3. הצבה של $\alpha_M$ בחזרה לבעיית האופטימיזציה על מנת לקבל ביטוי פשוט שאותו יש למזער כתלות ב $\tilde{h}_M$.

נציג ישר את הפתרון של בעיה זו, כאשר הפיתוח המלא של הפתרון מופיע בסוף ההרצאה.

</section><section>

## בעיית האופטימיזציה של AdaBoost

$$
\alpha_M,\tilde{h}_M=\underset{\alpha,\tilde{h}}{\arg\min}\quad
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^{M-1}\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})-\alpha y^{(i)}\tilde{h}(\boldsymbol{x}^{(i)})\right)
$$

<br/>

נגדיר את הגדלים הבאים:

$$
\begin{aligned}
\tilde{w}_i^{(M-1)}&=\exp\left(-\sum_{m=1}^{M-1}\alpha_m y^{(i)}\tilde{h}_m(\boldsymbol{x}^{(i)})\right)\\
w_i^{(M-1)}&=\frac{\tilde{w}_i^{(M-1)}}{\sum_{j=1}^N\tilde{w}_j^{(M-1)}}\\
\varepsilon(\tilde{h},\{w_i\})&=\sum_{i=1}^N w_iI\{y^{(i)}\neq \tilde{h}(\boldsymbol{x}^{(i)})\}
\end{aligned}
$$

</section><section>

## בעיית האופטימיזציה של AdaBoost

$\tilde{h}_M$ ו $\alpha_M$ האופטימאליים בכל שלב יהיו נתונים על ידי:

$$
\tilde{h}_M
=\underset{\tilde{h}}{\arg\min}\ \varepsilon(\tilde{h},\{w_i^{(M-1)}\})
=\underset{\tilde{h}}{\arg\min}\ \sum_{i=1}^N w_i^{(M-1)}I\{y^{(i)}\neq \tilde{h}(\boldsymbol{x}^{(i)})\}
$$

ו

$$
\alpha_M=\frac{1}{2}\ln\left(\frac{1-\varepsilon_M}{\varepsilon_M}\right)
$$

כאשר סימנו:

$$
\varepsilon_M=\varepsilon(\tilde{h}_M,\{w_i^{(M-1)}\})
$$

</section><section>

## בעיית האופטימיזציה של AdaBoost

אם כן, בכל שלב עלינו לבצע את פעולות הבאות:

1. חישוב המשקלים $\{w_i^{(M-1)}\}$.
2. מציאת החזאי $\tilde{h}$ אשר ממזער את ה misclassification rate הממושקל.
3. חישוב המקדם $\alpha_M$.

בפועל ניתן לחשב את המשקלים של ה צעד ה $M$ כבר בסוף הצעד ה $M-1$. בנוסף ניתן להשתמש בעובדה ש:

$$
\tilde{w}_i^{(M)}=\tilde{w}_i^{(M-1)}\exp\left(-\alpha_M y^{(i)}\tilde{h}_M(\boldsymbol{x}^{(i)})\right)
$$

בכדי להמנע מלחשב את הסכום על $m$ ולקצר את החישוב.

</section><section>

## האלגוריתם של AdaBoost

נאתחל את המשקולות  $w_i^{(0)}=\frac{1}{N}$.

1. נבחר את המסווג אשר ממזער את:

    $$
    \tilde{h}_M=\underset{\tilde{h}}{\arg\min}\ \sum_{i=1}^N w_i^{(M-1)}I\{y^{(i)}\neq \tilde{h}(\boldsymbol{x}^{(i)})\}
    $$

2. נחשב את המקדם $\alpha_{t+1}$ של המסווג:

    $$
    \begin{aligned}
    \varepsilon_M&=\sum_{i=1}^N w_i^{(M-1)}I\{y^{(i)}\neq \tilde{h}_{M}(\boldsymbol{x}^{(i)})\}\\
    \alpha_M&=\frac{1}{2}\ln\left(\frac{1-\varepsilon_M}{\varepsilon_M}\right)
    \end{aligned}
    $$

</section><section>

## האלגוריתם של AdaBoost

3. נעדכן את וקטור המשקלים:

    $$
    \begin{aligned}
    \tilde{w}_i^{(M)}&=w_i^{(M-1)}\exp\left(-\alpha_M y^{(i)}\tilde{h}_M(\boldsymbol{x}^{(i)})\right)\\
    w_i^{(M)}&=\frac{\tilde{w}_i^{(M)}}{\sum_{j=1}^N \tilde{w}_j^{(M)}}
    \end{aligned}
    $$

</section><section>

## המשמעות של המשקלים

המשקל ללא הנרמול של הדגימה ה $i$ שווה ל:

$$
\tilde{w}_i^{(M)}=\exp\left(-y^{(i)}\sum_{m=1}^{M}\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

- משקל זה מציין עד כמה טוב האלגוריתם מסווג את הדגימה ה $i$.
- דגימות שלא מסווגות נכון יהיו בעלות משקל גדול.
- התפקיד של המשקלים הוא לדאוג שהאלגוריתם יבחר בכל צעד את החזאי אשר ישפר את הסיווג בעיקר על הדגימות שעליהם החזאי הנוכחי טועה.

</section><section>

### תנאי עצירה

- בחלק גדול מהמקרים AdaBoost ילך ויקטין את שגיאת החיזוי על ה train set עד שהוא יגיע לסיווג מושלם.
- AdaBoost ממשיך לשפר את יכולת ההכללה שלהו גם אחרי שהוא הגיע לסיווג מושלם.
- כמות ה overfitting גדלה בקב מאד איטי.
- נרצה להריץ את האלגוריתם מספר רב של צעדים ולבדוק את הביצועים על validation set.

</section><section>

## קצב ההתכנסות של החסם

ראינו קודם כי שגיאת ה misclassification rate (הלא ממושקלת) של החזאי על המדגם חסומה על ידי ה הביטוי:

$$
\frac{1}{N}\sum_i I\{h(\boldsymbol{x}^{(i)})\neq y^{(i)}\}
\leq\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M y^{(i)}\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
$$

נראה כעת כי תחת תנאים מסויימים מובטח כי חסם זה ידאך ל-0 ככל שנגדיל את $M$.

</section><section>

## טענה

נסמן את ה misclassification rate הממושקל בצעד ה $m$ ב $\varepsilon_m=\frac{1}{2}-\gamma_m$. נטען כי מתקיים הקשר הבא:

$$
\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M y^{(i)}\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
\leq\exp\left(-2\sum_{m=1}^M\gamma_m^2\right)
$$

<br/>
<br/>

מכאן שבמידה וקיים $\gamma$ אשר מקיים $\gamma_m\geq\gamma>0$ אזי מתקיים ש:

$$
\frac{1}{N}\sum_i I\{h(\boldsymbol{x}^{(i)})\neq y^{(i)}\}
\leq\frac{1}{N}\sum_{i=1}^N\exp\left(-\sum_{m=1}^M y^{(i)}\alpha_m\tilde{h}_m(\boldsymbol{x}^{(i)})\right)
\leq\exp\left(-2M\gamma^2\right)
$$

זאת אומרת, שקיים חסם לשגיאת ה miscalssification rate אשר דועך באופן מעריכי עם $M$.

</section>
</div>