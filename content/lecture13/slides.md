---
type: lecture-slides
index: 13
template: slides
slides_pdf: true
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# הרצאה 13 - סיכום

<div dir="ltr">
<a href="/assets/lecture13_slides.pdf" class="link-button" target="_blank">PDF</a>
</div>

</section><section>

## תהליך פתרון בעיית supervised learning

<div class="imgbox no-shadow" style="max-height:600px">

![](./assets/workflow.png)

</div>
</section><section>

## הגדרת הבעיה

ב supervised learning תמיד ננסה למצוא חזאי $\hat{y}=h(\boldsymbol{x})$.

הפרדנו בין שתי מקרים:

- **בעיות סיווג (classification)**: $\text{y}$ דיסקרטי וסופי.
- **בעיות רגרסיה (regression)**: $\text{y}$ רציף.

</section><section>

## הערכת ביצועים

נגדיר את **פונקציית המחיר (cost)** שבה נרצה להשתמש בכדי להעריך את החזאי. לרוב נבחר פונקציית מחיר מהצורה:

$$
C(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
$$

פונקציות מסוג זה מכונות **פונקציות סיכון (risk)**.

הפונקציה $l$ מוכנה **פונקציית ההפסד (loss)**

- מכיוון שהפילוג של $\text{y}$ ו $\mathbf{x}$ לא באמת ידוע לנו אנו נשתמש ב **test set** ובתוחלת בכדי להאריך את הביצועים.

</section><section>

## פונקציות הפסד (פונקציות סיכון) נפוצות

<div style="direction:ltr">

| Common For | Loss Name | Risk Name | Loss Function | Optimal Predictor |
|------------|-----------|-----------|---------------|-------------------|
| Classification | Zero-One Loss | Misclassification Rate | $l\left(y_1,y_2\right)=I\left\lbrace  y_1\neq y_2\right\rbrace$ | $h^*\left(x\right)=\underset{y}{\arg\max}\ p_{\text{y}\mid\mathbf{x}}\left(y\mid x\right)$ |
| Regression | $L_1$ | Mean Absolute Error| $l\left(y_1,y_2\right)=\left\vert y_1-y_2\right\vert$ | Median: $h^*\left(x\right)=\hat{y}$<br>$s.t.\ F_{\text{y}\mid\mathbf{x}}\left(\hat{y}\mid x\right)=0.5$ |
| Regression | $L_2$ | Mean Squared Error (MSE) |$l\left(y_1,y_2\right)=\left(y_1-y_2\right)^2$ | $h^*\left(x\right)=\mathbf{E}\left[\text{y}\mid\mathbf{x}\right]$ |

</div>

</section><section>

## Discriminative vs. Generative

אנו מבחינים בין 3 גישות אשר משמשות לפתרון בעיות supervised learning:

- **גישה דיסקרימינטיבית**: $\mathcal{D}$ -> $h(\boldsymbol{x})$.
- **גישה גנרטיבית**: $\mathcal{D}$ -> $p_{\mathbf{x},\text{y}}(\boldsymbol{x},y)$ -> $p_{\text{y}|\mathbf{x}}(y|\boldsymbol{x})$ -> $h(\boldsymbol{x})$.
- **גישה דיסקרימינטיבית הסתברותית**: $\mathcal{D}$ -> $p_{\text{y}|\mathbf{x}}(y|\boldsymbol{x})$ -> $h(\boldsymbol{x})$.

</section><section>

## פירמול הבעיה

במרבית השיטות נשתמש במודל פרמטרי (לחזאי או לפילוג) ונרשום את בעיה כבעיית אופטימיזציה על הפרמטרים $\boldsymbol{\theta}$ של המודל:

$$
\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\quad f\left(\boldsymbol{\theta};\mathcal{D}\right) \\
$$

- לרוב לא נדע לפתור את הבעיה באופן אנליטי ונשתמש בשיטות אלטרנטיביות למציאת פתרון "סביר".

</section><section>

## Cross-Validation

למרבית השיטות יש מספר **hyper-parameters** שאינם חלק מבעיית האופטימיזציה שאותם יש לקבוע מראש.

<br/>

הדרך לבחור **hyper-parameters** הינה על ידי שימוש ב validation set על מנת לבדוק מספר ערכים שונים ולבחור את אלו אשר נותים את הביצועים הטובים ביותר.

</section><section>

## עיבוד מקדים (preprocessing)

במרבית המקרים אנו נרצה לבצע פעולות שונות על המדגם לפני הזנתו לאלגוריתם על מנת להקל על עבודת האלגוריתם.

<br/>

דוגמאות:

- חילוץ מאפיינים שנבחרו באופן ידני: $\boldsymbol{x}_{\text{new}}=\Phi(\boldsymbol{x})$.
- הורדת מימד (על ידי שימוש באלגוריתם כגון PCA).
- נרמול: $\boldsymbol{x}_{\text{new}}=\frac{1}{\sigma_{\mathbf{x}}}(\boldsymbol{x}-\mu_{\mathbf{x}})$
- אוגמנטציה (לא נלמד בקורס)

</section><section>

## מעבר על האלגוריתמים שנלמדו בקרוס

נעברו במהירות על האלגוריתמים שאותם ראינו בקרוס ונבחן את המאפיינים שלהם.

</section><section>

## Timeline

<div class="imgbox no-shadow" style="max-width:900px">

![](./assets/timeline.png)

</div>
</section><section style="direction:ltr">

## Empirical Risk Minimization

- Problem type:
  <span class="fragment" style="color:#006992">
  Regression
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Optimization problem:
  <span class="fragment" style="color:#006992">
  $\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\ \frac{1}{N}\sum_i l(h(\boldsymbol{x}^{(i)};\boldsymbol{\theta}),y^{(i)})$
  </span>
  
</section><section style="direction:ltr">

## Linear Least Squares (LLS)<br>(also known as ordinary least squares-OLS)

- Problem type:
  <span class="fragment" style="color:#006992">
  Regression with MSE risk
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $h(\boldsymbol{x};\boldsymbol{\theta})=\boldsymbol{\theta}^{\top}\boldsymbol{x}$
  </span>
- Optimization problem:
  <span class="fragment" style="color:#006992">
  $\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\ \frac{1}{N}\sum_i (\boldsymbol{\theta}^{\top}\boldsymbol{x}^{(i)}-y^{(i)})^2$
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Closed solution: $\boldsymbol{\theta}=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}$.
  </span>

</section><section style="direction:ltr">

## Ridge Regression<br/>(LLS with Tikhonov Regularization ($l_2$))

- Problem type:
  <span class="fragment" style="color:#006992">
  Regression with MSE risk
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $h(\boldsymbol{x};\boldsymbol{\theta})=\boldsymbol{\theta}^{\top}\boldsymbol{x}$
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  Regularization coefficient $\lambda$
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  $\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\ \frac{1}{N}\sum_i (\boldsymbol{\theta}^{\top}\boldsymbol{x}^{(i)}-y^{(i)})^2+\lambda\lVert\boldsymbol{\theta}\rVert_2^2$
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  $\boldsymbol{\theta}=(X^{\top}X+\lambda I)^{-1}X^{\top}\boldsymbol{y}$.
  </span>

</section><section style="direction:ltr">

## Least Absolute Shrinkage and Selection Operator (LASSO)<br/>(LLS with $l_2$ Regularization)

- Problem type:
  <span class="fragment" style="color:#006992">
  Regression with MSE risk
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $h(\boldsymbol{x};\boldsymbol{\theta})=\boldsymbol{\theta}^{\top}\boldsymbol{x}$
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  Regularization coefficient $\lambda$
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  $\boldsymbol{\theta}^*=\underset{\boldsymbol{\theta}}{\arg\min}\ \frac{1}{N}\sum_i (\boldsymbol{\theta}^{\top}\boldsymbol{x}^{(i)}-y^{(i)})^2+\lambda\sum_j\lvert\theta_j\rvert$
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Variants of gradient descent (were not presented in the course).
  </span>

</section><section style="direction:ltr">

## K-Nearest Neighbors (K-NN)

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification (and also regression)
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  Number of neighbors $K$.
  </span>
- Properties:
  <div class="fragment" style="color:#006992">

  - Required amount of data is exponential in the dimension. Good for low dimensions with a lot of data.
  - Slow runtime.

  </div>

</section><section style="direction:ltr">

## Decision Trees

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification or regression
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  A tree with nodes that threshold a single feature.
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  Number of nodes.
  </span>
- Optimization:
  <div class="fragment" style="color:#006992">

  - Classification: Minimize entrophy or the Gini index.
  - Regression: Minimize RMSE.

  </div>
- How to solve:
  <span class="fragment" style="color:#006992">
  Add nodes in a greedy manner + pruning.
  </span>

</section><section style="direction:ltr">

## Decision Trees - Cont.

- Properties:
  <div style="color:#006992">

  - Very efficient runtime.
  - Usually overfits but can efficiently be combined with bagging or boosting.
  - Can work with categorical features.

  </div>

</section><section style="direction:ltr">

## Histogram

- Approach:
  <span class="fragment" style="color:#006992">
  Generative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  Piecewise constant probability function.
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  Bin edges.
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Count relative number of samples in each bin.
  </span>
- Properties:
  <div class="fragment" style="color:#006992">

  - Not very usefull for supervised learning.
  - Required amount of data is exponential in the dimension.
  - Great for quick visualization.

  </div>

</section><section style="direction:ltr">

## KDE

- Approach:
  <span class="fragment" style="color:#006992">
  Generative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  Linear combination of $N$ shifted kernel functions.
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The kernel function
  </span>
- Properties:
  <div class="fragment" style="color:#006992">

  - Required amount of data is exponential in the dimension. Good for low dimensions with a lot of data.

  </div>

</section><section style="direction:ltr">

## Linear Discriminant Analysis (LDA)

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Generative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $p_{\mathbf{x}|\text{y}}(\boldsymbol{x}|y)=\frac{1}{\sqrt{(2\pi)^d|\Sigma|}}e^{-\frac{1}{2}\left(\boldsymbol{x}-\boldsymbol{\mu}_y\right)^T\Sigma^{-1}\left(\boldsymbol{x}-\boldsymbol{\mu}_y\right)}$
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  MLE (or MAP)
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Has a close form solution.
  </span>
- Properties:
  <div class="fragment" style="color:#006992">

  - Linear separetion lines.
  - Good when each class is consentrated in a different area of the feature space.
  - Can deal with classes with very few eaxmples (even 1).

  </div>

</section><section style="direction:ltr">

## Quadric Discriminant Analysis (QDA)

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Generative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $p_{\mathbf{x}|\text{y}}(\boldsymbol{x}|y)=\frac{1}{\sqrt{(2\pi)^d|\Sigma_y|}}e^{-\frac{1}{2}\left(\boldsymbol{x}-\boldsymbol{\mu}_y\right)^T\Sigma_y^{-1}\left(\boldsymbol{x}-\boldsymbol{\mu}_y\right)}$
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  MLE (or MAP)
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Has a close form solution.
  </span>
- Properties:
  <div class="fragment" style="color:#006992">

  - Quadric separetion lines.
  - Good when each class is consentrated in a different area of the feature space.

  </div>

</section><section style="direction:ltr">

## Logistic Regression

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Probabilistic Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $p_{\text{y}|\mathbf{x}}(y|\boldsymbol{x})=\text{softmax}(F(\boldsymbol{x};\boldsymbol{\theta}))_y=\frac{e^{f_y(\boldsymbol{x};\boldsymbol{\theta}_y)}}{\sum_c e^{f_c(\boldsymbol{x};\boldsymbol{\theta}_c)}}$
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The functions $f_y(\boldsymbol{x};\boldsymbol{\theta}_y)$.
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  MLE (or MAP)
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Gradient descent.
  </span>

</section><section style="direction:ltr">

## Linear Logistic Regression

- Problem type:
  <span class="fragment" style="color:#006992">
  Classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Probabilistic Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $p_{\text{y}|\mathbf{x}}(y|\boldsymbol{x})=\text{softmax}(\Theta\boldsymbol{x})_y=\frac{e^{\boldsymbol{\theta}_y^{\top}\boldsymbol{x}}}{\sum_c e^{\boldsymbol{\theta}_c^{\top}\boldsymbol{x}}}$
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The functions $f_y(\boldsymbol{x};\boldsymbol{\theta}_y)$.
  </span>
- Optimization:
  <span class="fragment" style="color:#006992">
  MLE (or MAP)
  </span>
- How to solve:
  <span class="fragment" style="color:#006992">
  Gradient descent.
  </span>

</section><section style="direction:ltr">

## Multi-Layer Perceptron (MLP)

- Problem type:
  <span class="fragment" style="color:#006992">
  Either
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Probabilistic Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  A neural network of fully connected layers.
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The number of layers and their width + activation functions.
  </span>
- Optimization:
  <div class="fragment" style="color:#006992">

  - Classification: MLE (or MAP)
  - Regression: ERM

  </div>

- How to solve:
  <span class="fragment" style="color:#006992">
  Gradient descent + backpropogation.
  </span>
- Property:
  <span class="fragment" style="color:#006992">
  Requiers large amount of data in order to avoid overfiting.
  </span>

</section><section style="direction:ltr">

## Convolutional Neural Network (CNN)

- Problem type:
  <span class="fragment" style="color:#006992">
  Either
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Probabilistic Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  A NN of convolutional + fully connected layers.
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The architecture.
  </span>
- Optimization:
  <div class="fragment" style="color:#006992">

  - Classification: MLE (or MAP)
  - Regression: ERM

  </div>

- How to solve:
  <span class="fragment" style="color:#006992">
  Gradient descent + backpropogation.
  </span>
- Property:
  <span class="fragment" style="color:#006992">
  Very efficient when $\boldsymbol{x}$ has some spatial structure.
  </span>

</section><section style="direction:ltr">

## Hard SVM

- Problem type:
  <span class="fragment" style="color:#006992">
  Binary classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $h(\boldsymbol{x})=\text{sign}(\boldsymbol{w}^T\boldsymbol{x}+b)$
  </span>
- Optimization:
  <div class="fragment" style="color:#006992">

  $$
  \begin{aligned}
  \boldsymbol{w}^*,b^*
  =\underset{\boldsymbol{w},b}{\arg\min}\quad&\frac{1}{2}\lVert\boldsymbol{w}\rVert^2\\
  \text{s.t.}\quad&(\boldsymbol{w}^{\top}\boldsymbol{x}^{(i)}+b)y^{(i)}\geq1\quad\forall i
  \end{aligned}
  $$

  </div>

- How to solve:
  <span class="fragment" style="color:#006992">
  Numerical convex optimization solvers.
  </span>
- Property:
  <span class="fragment" style="color:#006992">
  Requiers the data to be linear sperable.
  </span>

</section><section style="direction:ltr">

## Soft SVM

- Problem type:
  <span class="fragment" style="color:#006992">
  Binary classification
  </span>
- Approach:
  <span class="fragment" style="color:#006992">
  Discriminative
  </span>
- Model:
  <span class="fragment" style="color:#006992">
  $h(\boldsymbol{x})=\text{sign}(\boldsymbol{w}^T\boldsymbol{x}+b)$
  </span>
- Hyper-parameter:
  <span class="fragment" style="color:#006992">
  The slack penalty term $C$.
  </span>
- Optimization:
  <div class="fragment" style="color:#006992">

  $$
  \begin{aligned}
  \boldsymbol{w}^*,b^*,\{\xi_i\}^*=
  \underset{\boldsymbol{w},b,\{\xi_i\}}{\arg\min}\quad&\frac{1}{2}\left\lVert\boldsymbol{w}\right\rVert^2+C\sum_{i=1}^N\xi_i \\
  \text{s.t.}\quad
      &y^{(i)}\left(\boldsymbol{w}^{\top}\boldsymbol{x}^{(i)}+b\right)\geq1-\xi_i\quad\forall i\\
      &\xi_i\geq0\quad\forall i
  \end{aligned}
  $$

  </div>

</section><section style="direction:ltr">

## Soft SVM - Cont.

- How to solve:
  <span style="color:#006992">
  Numerical convex optimization solvers.
  </span>
- Property:
  <span class="fragment" style="color:#006992">
  Can be very efficient when combined with the right kernal using the kernal-trick.
  </span>

</section><section>

## Bagging and Boosting

בנוסף לכל השיטות הנ"ל ראינו גם כיצד ניתן לשלב מספר חזאים באופן הבא:

- בעזרת **bagging** בכדי להקטין את ה variance (overfitting) של החזאים.
- בעזרת **AdaBoost** בכדי להקטין את ה bias (underfitting) של החזאים.

</section><section>

## Bagging and Boosting

בנוסף לכל השיטות הנ"ל ראינו גם כיצד ניתן לשלב מספר חזאים באופן הבא:

- בעזרת **bagging** בכדי להקטין את ה variance (overfitting) של החזאים.
- בעזרת **AdaBoost** בכדי להקטין את ה bias (underfitting) של החזאים.

</section><section>

## מה הלאה - קורסים?

קרוסים נוספים בפקולטה בתחום:

- 046202 - עיבוד וניתוח מידע (unsupervised).
- 046211 - למידה עמוקה.
- 046203 - תכנון ולמידה מחיזוקים (reinfocment).
- 046746 - אלגוריתמים ויישומים בראיה ממוחשבת.

</section><section>

## מה הלאה - deep learning?

הכרת טכניקות ספציפיות ברשתות נוירונים (ארכיטקטורות, אופטימיזציות, רגולריזציה וכו'):

- מאד דינמי ומשתנה בקצב גבוה.
- משתנה מבעיה לבעיה.
- הכי טוב זה לקחת בעיה ולראות מה השיטות בהם משתמשים כיום בכדי לפתור אותה.
- המון Google.

</section><section>

## מה הלאה - צבירת נסיון?

התחום של מערכות לומדות דורש המון נסיון ואינטואיציה שנרכשים עם הזמן.

- פרוייקט בתחום.
- [Kaggle](https://www.kaggle.com/competitions).

</section><section>

## חברי סגל בתחום

- נחום שימקין (דיקן הפקולטה)
- שי מנור
- רון מאיר
- קובי קרמר
- תומר מכאלי
- אביב תמרי
- דניאל סודרי
- כפיר לוי

</section><section class="center">

# מקווה שנהנתם...

</section>
</div>
