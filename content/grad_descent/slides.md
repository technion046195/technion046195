---
template: slides
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# Gradient descent (אלגוריתם הגרדיאנט)

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

<br/>

<div class="imgbox" style="max-height:400px">

![](./assets/sled.jpg)

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

בעובר $\boldsymbol{\theta}^{(0)}=[100,100,100]^{\top}$ (ו $\eta=0.1$) מקבלים את הפתרון הבא:

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
