---
type: tutorial
index: 13
template: page
make_docx: false
print_pdf: false
---

<div dir="rtl" class="site-style">

# תרגול 13 - PCA and K-means

<div dir="ltr">
<a href="./slides/" class="link-button" target="_blank">Slides</a>
<a href="/assets/tutorial13.pdf" class="link-button" target="_blank">PDF</a>
<!-- <a href="./code/" class="link-button" target="_blank">Code</a> -->
</div>

## תקציר התיאוריה - PCA

PCA הוא אלגוריתם מאד נפוץ אשר משמש במוקומות רבים על מנת למצוא יצווג נוח יותר לוקטורים על סמך מדגם נתון. אחד השימושים העיקריים של האלגוריתם הינו בכדי לבצע **הורדת מימד** של הוקטורים. (לייצג את וקטורים בעזרת וקטור ממימד נמוך יותר).

### הגדרות

בעבור מדגם נתון $\mathcal{D}=\{\boldsymbol{x}^{(i)}\}_{i=1}^N$ של $N$ וקטורים באורך $D$ נגדיר את הגדלים הבאים:

- הממוצע של המדגם: $\bar{\boldsymbol{x}}=\frac{1}{N}\sum_{i=1}^N \boldsymbol{x}^{(i)}$.
- מטריצת הדגמות:

    $$
    X=\begin{pmatrix}
      - & (\boldsymbol{x}^{(1)}-\boldsymbol{\mu})^{\top} & -\\
      - & (\boldsymbol{x}^{(2)}-\boldsymbol{\mu})^{\top} & -\\
        & \vdots &  \\
      - & (\boldsymbol{x}^{(N)}-\boldsymbol{\mu})^{\top} & -\\
    \end{pmatrix}
    $$

- הקווריאנס האמפירי של המדגם: $P=X^{\top}X$.

נתייחס לפירוק (ליכסון) הבא: $P=U\Lambda U^{\top}$ כאשר $U$ היא מטריצה אורתונורמלית אשר שורותיה הם וקטורים עצמיים של $P$:

$$
U=\begin{pmatrix}
  | & |  &  & | \\
  \boldsymbol{u}^{(1)} & \boldsymbol{u}^{(2)} & \dots & \boldsymbol{u}^{(D)} \\
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

### הטרנספורמציה אותה מבצע PCA

PCA מייצר מתוך מדגם נתון $\mathcal{D}=\{\boldsymbol{x}^{(i)}\}_{i=1}^N$ טרנספורמציה אפינית (affine = linear + offset) אשר ממפה וקטור $\boldsymbol{x}$ באורך $D$ לוקטור $\boldsymbol{z}$ באורך $k\leq D$. כאשר $k$ הוא קבוע אשר נבחר מראש. הטרנפורמציה הינה:

$$
\boldsymbol{z}=T^{\top}(\boldsymbol{x}-\bar{\boldsymbol{x}})
$$

כאשר $T$ הינה מטריצה המכילה את $k$ השורות הראשונות של $U$ (זאת אומרת הוקטורים העצמיים המתאימים ל $k$ הערכים העצמיים הגדולים ביותר).

האיברים של $\boldsymbol{z}$ נקראים ה**רכיבים הראשיים (principal components)** של $\boldsymbol{x}$.

### פרשנות גיאומטרית

הפעולה שאותה מבצעת הטרנספורמציה הינה:

1. להזיז את הנקודות של המדגם כך שהמרכז שלהם יהיה בראשית.
2. הטלה של הנקודות המוזזות על תת-המרחב שמוגדרת על ידי הוקטורים $\{\boldsymbol{u}_j\}$.

<div class="imgbox" style="max-width:900px">

![](../lecture12/assets/pca.png)

</div>

### מוטיבציה ראשונה: מקסימום שונות

אחת ההצדקות הראשונות לבחירה של $T$ הינה שתחת האילוץ ש $\boldsymbol{z}$ הוא באורך $k$ הבחירה הנוכחית של $T$ הינה הבחירה אשר ממקסמת את הגודל:

$$
\frac{1}{N}\sum_{i=1}^N\lVert\boldsymbol{z}^{(i)}\rVert_2^2
$$

אשר מכוונה לרוב השונות של הוקטורים $\{\boldsymbol{z}^{(i)}\}_{i=1}^N$ (בפועל זה ה trace של מטריצת ה covariance).

### מוטיבציה שניה: מזעור שגיאת השחזור הריבועית

נסתכל על זוג טרנספורמציות אפיניות כלליות מ $\boldsymbol{x}$ ל $\boldsymbol{z}$ באורך $k$, ומ $\boldsymbol{z}$ ל $\tilde{\boldsymbol{x}}$:

$$
\begin{aligned}
\boldsymbol{z}=A\boldsymbol{x}+\boldsymbol{b}\\
\tilde{\boldsymbol{x}}=C\boldsymbol{z}+\boldsymbol{d}
\end{aligned}
$$

נסמן את שגיאת השיחזור הריבועית באופן הבא: $\sum_{i=1}^N(\tilde{\boldsymbol{x}}^{(i)}-\boldsymbol{x}^{(i)})^2$.

הטרנצפורמציות שימזערו את שיגאת השיחזור הריבועית הינם:

$$
\begin{aligned}
\boldsymbol{z}=U(\boldsymbol{x}-\boldsymbol{\mu})\\
\tilde{\boldsymbol{x}}=U^T\boldsymbol{z}+\boldsymbol{\mu}
\end{aligned}
$$

## תקציר התיאוריה - K-Means

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
\underset{\{\mathcal{I}_j\}_{k=1}^K}{\arg\min}\frac{1}{N}\sum_{k=1}^K\sum_{i\in\mathcal{I}_k}\lVert\boldsymbol{x}^{(i)}-\boldsymbol{\mu}_k\rVert^2
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

## תרגיל 13.1 - PCA

עבוד מדגם נתון של וקטורים ב $\mathbb{R}^2$ חושבו וקטור הממוצע ומטריצת הקוואריאנס הבאים:

$$
\bar{\boldsymbol{x}}=\begin{pmatrix}0\\0\end{pmatrix}
$$

$$
P=\begin{pmatrix}
  3 & 2 \\
  2 & 6
\end{pmatrix}
$$

**1)** איזה מהוקטורים הבאים מייצג את הכיוון הראשון $\boldsymbol{u}_1$ במטריצת ההטלה של PCA?

$$
\frac{1}{\sqrt{5}}\begin{pmatrix}
  -2 \\
  1
\end{pmatrix},\qquad
\frac{1}{\sqrt{2}}\begin{pmatrix}
  1 \\
  1
\end{pmatrix},\qquad
\frac{1}{\sqrt{5}}\begin{pmatrix}
  1 \\
  2
\end{pmatrix},\qquad
$$

**2)** חשבו את שני ה principal componnents של $x=(1,0)^{\top}$.

### פתרון 13.1

#### 1)

נשתמש בעובדה ש $\boldsymbol{ו}_1$ צריך להיות וקטור עצמי של $P$ ולכן מקיים $P\boldsymbol{u}_1=\lambda_1\boldsymbol{u}_1$. בדוק ממה וקטורים הבאים מקיים זאת:

$$
P\boldsymbol{u}_1
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  3 & 2 \\
  2 & 6
\end{pmatrix}
\begin{pmatrix}
  -2 \\
  1
\end{pmatrix}
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  -4 \\
  2
\end{pmatrix}
=2\boldsymbol{u}_1
$$

$$
P\boldsymbol{u}_1
=\frac{1}{\sqrt{2}}\begin{pmatrix}
  3 & 2 \\
  2 & 6
\end{pmatrix}
\begin{pmatrix}
  1 \\
  1
\end{pmatrix}
=\frac{1}{\sqrt{2}}\begin{pmatrix}
  5 \\
  8
\end{pmatrix}
\neq \alpha\boldsymbol{u}_1
$$

$$
P\boldsymbol{u}_1
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  3 & 2 \\
  2 & 6
\end{pmatrix}
\begin{pmatrix}
  1 \\
  2
\end{pmatrix}
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  7 \\
  14
\end{pmatrix}
=7\boldsymbol{u}_1
$$

מכאן שגם הוקטור הראשון וגם השלישי הם וקטורים עצמיים. הוקטור הראשון בהטלה של PCA יהיה השלישי שכן הוא מתאים לערך עצמי גדול יותר:

$$
\boldsymbol{u}_1=
\frac{1}{\sqrt{5}}\begin{pmatrix}
  1 \\
  2
\end{pmatrix},\qquad
$$

#### 2)

הרכיב העיקרי (principal componant) הראשון יהיה נתון על ידי:

$$
z_1=\boldsymbol{u}_1^{\top}(\boldsymbol{x}-\mu)
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  1 & 2
\end{pmatrix}
\begin{pmatrix}
  1 \\
  0
\end{pmatrix}
=\frac{1}{\sqrt{5}}
$$

והרכיב השני יהיה:

$$
z_1=\boldsymbol{u}_1^{\top}(\boldsymbol{x}-\mu)
=\frac{1}{\sqrt{5}}\begin{pmatrix}
  -2 & 1
\end{pmatrix}
\begin{pmatrix}
  1 \\
  0
\end{pmatrix}
=\frac{-2}{\sqrt{5}}
$$

בעבור PCA עם $k=2$ נקבל:

$$
\boldsymbol{z}=\frac{1}{\sqrt{5}}(1,-2)^{\top}
$$

## תרגיל 13.2

נתונות $\left(1+3\alpha\right)n$ נקודות שונות:

- $n$ נקודות בקואורדינאטות $A=\left(-6,6\right)$
- $\alpha n$ נקודות בכל אחת מהקואורדינאטות $B=\left(6,6\right),C=\left(8,6\right),D=\left(1,-6\right)$

<div class="imgbox" style="max-width:500px">

![](./output/ex_13_2_dataset.png)

</div>

(הנקודות יושבות אחת על השניה בכל קואורדינטה, ומצויירות כעיגולים רק לצורך השרטוט). רוצים לבצע אשכול של הנקודות ל3 אשכולות בעזרת K-Means.

**1)** מאתחלים את המרכזים על ידי בחירה אקראית של 3 מתוך ארבעת הנקודות A,B,C,D. לאילו חלוקות יתכנס האלגוריתם בעבור כל אחת מארבעת האתחולים האפשריים.

**2)** מהו האשכול האופטימאלי (הממזער של פונקציית המטרה)? רשמו את הפתרון כתלות בפרמטר $\alpha$. (ניתן להניח כי בפתרון האופטימאלי כל הנקודות שנמצאות באותו המקום משוייכות לאותו האשכול)

**3)** האם קיים אתחול אשר בעבורו האלגוריתם לא יתכנס לפתרון האופטימאלי שמצאתם בסעיף הקודם? הדגימו.

### פתרון 13.2

#### 1)

נחשב את תוצאת האלגוריתם בעבור כל אחת מארבעת האתחולים:

**מרכזים ב A,B ו C**:

<div class="imgbox" style="max-width:100%">
<div class="imgbox no-shadow" style="max-width:25%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_1_0a.png)

</div><div class="imgbox no-shadow" style="max-width:25%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_1_0b.png)

</div><div class="imgbox no-shadow" style="max-width:25%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_1_1a.png)

</div><div class="imgbox no-shadow" style="max-width:25%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_1_1b.png)

</div>
</div>

- שיוך התחלתי (0a): נקודות בA,B ו C ישוייכו למרכז אשר הנמצא עליהם, והנקודות בD ישוייכו למרכז שבB.
- עדכון מרכזים (0b): המרכז שב B יזוז לאמצע הדרך שבין הנקודות B ו D.
- עדכון אשכולות (1a): הנקודת שבB ישוייכו כעת למרכז שבC.
- עדכון מרכזים (1b): המרכז שבין B ל D יזוז לD, והמרכז שבC יזוז למחצית הדרך שבין B לC.

**מרכזים ב A,B ו D**:

<div class="imgbox" style="max-width:600px">
<div class="imgbox no-shadow" style="max-width:50%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_2_0a.png)

</div><div class="imgbox no-shadow" style="max-width:50%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_2_0b.png)

</div>
</div>

- שיוך התחלתי (0a): נקודות בA,B ו D ישוייכו למרכז אשר נמצא עליהם, והנקודות בC ישוייכו למרכז שבB.
- עדכון מרכזים (0b): המרכז שב B יזוז לאמצע הדרך שבין הנקודות B ו C.
  
**מרכזים ב A,C ו D**:

<div class="imgbox" style="max-width:600px">
<div class="imgbox no-shadow" style="max-width:50%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_3_0a.png)

</div><div class="imgbox no-shadow" style="max-width:50%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_3_0b.png)

</div>
</div>

- שיוך התחלתי (0a): נקודות בA,C ו D ישוייכו למרכז אשר נמצא עליהם, והנקודות בB ישוייכו למרכז שבC.
- עדכון מרכזים (0b): המרכז שב C יזוז לאמצע הדרך שבין הנקודות B ו C.

**מרכזים ב B,C ו D**:

<div class="imgbox" style="max-width:300px">

![](./output/ex_13_2_a_case_4_0a.png)

</div>

- שיוך התחלתי (0a): נקודות בB,C ו D ישוייכו למרכז אשר נמצא עליהם, והנקודות בA ישוייכו למרכז שבB.
- עדכון מרכזים (0b): המרכז שב B יזוז לנקודה שהיא המרכז של הנקודות A ו B. (משום שכמות הנקודות בשתי הקבוצות שונה, נקודה זו היא לא אמצע הדרך בניהם).

השלב הבא של עידכון האשכולות תלוי במיקום של המרכז החדש. 

**מקרה 1**: הנקודות ב-B קרובות יותר למרכז החדש מאשר למרכז שב-C ולכן האלגוריתם מסתיים.

<div class="imgbox" style="max-width:300px">

![](./output/ex_13_2_a_case_4_1_0b.png)

</div>

**מקרה 2**, המרכז החדש **רחוק** יותר לנקודה B מאשר הנקודה C, אזי הנקודות בB יהיו מושייכות כעת למרכז בנקודה C, והמשך האלגוריתם יהיה:

<div class="imgbox" style="max-width:100%">
<div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_4_2_0b.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_4_2_1a.png)

</div><div class="imgbox no-shadow" style="max-width:33%;display:inline-block;margin:0">

![](./output/ex_13_2_a_case_4_2_1b.png)

</div>
</div>

נמצא את התנאי על $\alpha$ שבעבורו מתרחש מקרה 2. נסמן ב $\boldsymbol{\mu}_1$ את המרכז שבין A לB לאחר עדכון המרכזים הראשון. המיקום של $\boldsymbol{\mu}_1$ נתון על ידי הממוצע המשוכלל של הקואורדיאנטות A ו B:

$$
\boldsymbol{\mu}_1=\frac{n\vec{A}+\alpha n\vec{B}}{\left(1+\alpha\right)n}=\frac{\left(-6\hat{x}_1 + 6\hat{x}_2\right)+\alpha\left(6\hat{x}_1 + 6\hat{x}_2\right)}{1+\alpha}=\frac{\alpha-1}{\alpha+1}6\hat{x}_1 + 6\hat{x}_2
$$

על מנת שיתרחש עידכון על המרחק בין המרכז החדש נקודה B גדול מ2:

$$
\begin{aligned}
\left\lVert\left(6\hat{x}_1 + 6\hat{x}_2\right)-\left(\frac{\alpha-1}{\alpha+1}6\hat{x}_1 + 6\hat{x}_2\right)\right\rVert>2 \\
\Leftrightarrow 6-\frac{\alpha-1}{\alpha+1}6>2 \\
\Leftrightarrow \frac{\alpha-1}{\alpha+1}6<4 \\
\Leftrightarrow\alpha<5
\end{aligned}
$$

#### 2)

ב) אנו מועניינים למצוא את האשכול אשר מביא למינימום את הפונקציית המטרה הבאה:

$$
\sum_{k=1}^K\frac{1}{2|\mathcal{I}_k|}\sum_{i,j\in \mathcal{I}_k}\lVert\boldsymbol{x}^{(j)}-\boldsymbol{x}^{(i)}\rVert_2^2
$$

נוכל לפסול פתרונות בהן ישנו אשכול ריק, משום שבמקרה זה נוכל לשייך אליו נקודות כלשהן על מנת להקטין את פונקציית המטרה. לכן הפתרון האופטימאלי חייב להיות אחד מששת האישכולים הבאים:

- (A,B), (C), (D)
- (A,C), (B), (D)
- (A,D), (B), (C)
- (B,C), (A), (D)
- (B,D), (A), (C)
- (C,D), (A), (B)

התרומה של האשכולות שמכילים נקודה בודדת לפונקציית המטרה הינה 0, ולכן יש לחשב רק את התרומה של האשכול שמכיל זוג נקודות. למשל, עבור האשכול (A,B), (C), (D) נקבל:

$$
\sum_{k=1}^K\sum_{i\in\mathcal{I}_k}\lVert\boldsymbol{x}^{(j)}-\boldsymbol{\mu}^{(i)}\rVert_2^2
=n\left(-6-6\frac{\alpha-1}{\alpha+1}\right)^2 + \alpha n\left(6-6\frac{\alpha-1}{\alpha+1}\right)^2=n\cdot \frac{36}{\left(\alpha+1\right)^2}\left(4\alpha^2+4\alpha\right)=\frac{144\alpha n}{\alpha+1}
$$

ועבור האשכול (B,C), (A), (D) נקבל:
$$
\sum_{i=1}^K\sum_{j\in G_i}\left\lVert \boldsymbol{x}_j-\boldsymbol{\mu}_i \right\rVert^2
=\alpha n\left(1\right)^2 + \alpha n\left(1\right)^2=2\alpha n
$$

נחשב את הערך של פונקצייות המטרה בעבור כל אחד מששת האשכולים:

<div style="direction=ltr">

| Clusters | Objective |
| -------- | --------- |
| (A,B), (C), (D) | $$144\frac{\alpha n}{\alpha+1}$$ |
| (A,C), (B), (D) | $$193\frac{\alpha n}{\alpha+1}$$ |
| (A,D), (B), (C) | $$196\frac{\alpha n}{\alpha+1}$$ |
| (B,C), (A), (D) | $$2\alpha n$$ |
| (B,D), (A), (C) | $$30.5\alpha n$$ |
| (C,D), (A), (B) | $$42.5\alpha n$$ |

</div>

נשים לב כי הפתרון האופטימאלי יהיה חייב להיות (A,B),(C),(D) או (B,C),(A),(D) (משום שכל השאר בהכרח גדולים מהם). נבדוק בעבור אלו ערכים של $\alpha$ האשכול הראשון הינו האופטימאלי:

$$
\begin{aligned}
144\frac{\alpha n}{\alpha+1}<2\alpha n \\
\Leftrightarrow \alpha>71
\end{aligned}
$$

אם כן, בעבור $\alpha>71$ הפתרון האופטימאלי הינו (A,B),(C),(D) ובעבור $\alpha<71$ הפתרון האופטימאלי הינו  (B,C),(A),(D).

נסכם כי עבור אתחול המרכזים בנקודות B,C ו-D נקבל:

- עבור $\alpha<5$  האלגוריתם ישדך את B ו-C וזהו הפתרון האופטימאלי גלובלית.
- עבור $\alpha>71$  האלגוריתם ישדך את A ו-B וזה הפתרון האופטימאלי גלובלית.
- עבור $5<\alpha<71$  האלגוריתם ישדך את A ו-B אולם זהו אינו הפתרון הגלובלי.

נבדוק בעבור האתחולים מהסעיף הקודם, מהם המקרים שבהם האלגוריתם אינו מתכנס לפתרון האופטימאלי:

- בעבור $\alpha>71$ הפתרון האופטימאלי הינו (A,B),(C),(D), אך עבור 3 מתוך 4 האיחולים שבדקנו האלגוריתם התכנס לפתרון של  (B,C),(A),(D).
- בעבור $\alpha<71$ הפתרון האופטימאלי הינו  (B,C),(A),(D), אך במקרה של $\alpha>5$ ואתחול של מרכזים ב B,C ו D מתקבל הפתרון של (A,B),(C),(D).

ג) כל מקרים שצויינו בסעיף הקודם. בנוסף,ניתן לדוגמא לאתחל שניים מתוך שלושת המרכזים בנקודות מאד רחוקות, ואז כל הנקודות ישוייכו למרכז השלישי.

<!--

## בעיה מעשית

<a href="https://colab.research.google.com/github/{{ site.data.general.github_user }}/{{ site.data.general.github_repo }}/blob/master/_tutorials/tutorial_04/code/taxi_k_means.ipynb" target="_blank">
<img alt="Open In Colab" src="https://colab.research.google.com/assets/colab-badge.svg" style="display: inline">
</a>

### 🚖 תזכורת: מדגם נסיעות המונית בNew York

עשרת הדגמים הראשונים במדגם הנסיעות בעיר New York

<table border="1" style="text-align:center;">
  <thead>
    <tr>
      <th></th>
      <th>passenger_count</th>
      <th>trip_distance</th>
      <th>payment_type</th>
      <th>fare_amount</th>
      <th>tip_amount</th>
      <th>pickup_easting</th>
      <th>pickup_northing</th>
      <th>dropoff_easting</th>
      <th>dropoff_northing</th>
      <th>duration</th>
      <th>day_of_week</th>
      <th>day_of_month</th>
      <th>time_of_day</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2</td>
      <td>2.768065</td>
      <td>2</td>
      <td>9.5</td>
      <td>0.00</td>
      <td>586.996941</td>
      <td>4512.979705</td>
      <td>588.155118</td>
      <td>4515.180889</td>
      <td>11.516667</td>
      <td>3</td>
      <td>13</td>
      <td>12.801944</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>3.218680</td>
      <td>2</td>
      <td>10.0</td>
      <td>0.00</td>
      <td>587.151523</td>
      <td>4512.923924</td>
      <td>584.850489</td>
      <td>4512.632082</td>
      <td>12.666667</td>
      <td>6</td>
      <td>16</td>
      <td>20.961389</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>2.574944</td>
      <td>1</td>
      <td>7.0</td>
      <td>2.49</td>
      <td>587.005357</td>
      <td>4513.359700</td>
      <td>585.434188</td>
      <td>4513.174964</td>
      <td>5.516667</td>
      <td>0</td>
      <td>31</td>
      <td>20.412778</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>0.965604</td>
      <td>1</td>
      <td>7.5</td>
      <td>1.65</td>
      <td>586.648975</td>
      <td>4511.729212</td>
      <td>586.671530</td>
      <td>4512.554065</td>
      <td>9.883333</td>
      <td>1</td>
      <td>25</td>
      <td>13.031389</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1</td>
      <td>2.462290</td>
      <td>1</td>
      <td>7.5</td>
      <td>1.66</td>
      <td>586.967178</td>
      <td>4511.894301</td>
      <td>585.262474</td>
      <td>4511.755477</td>
      <td>8.683333</td>
      <td>2</td>
      <td>5</td>
      <td>7.703333</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5</td>
      <td>1.561060</td>
      <td>1</td>
      <td>7.5</td>
      <td>2.20</td>
      <td>585.926415</td>
      <td>4512.880385</td>
      <td>585.168973</td>
      <td>4511.540103</td>
      <td>9.433333</td>
      <td>3</td>
      <td>20</td>
      <td>20.667222</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1</td>
      <td>2.574944</td>
      <td>1</td>
      <td>8.0</td>
      <td>1.00</td>
      <td>586.731409</td>
      <td>4515.084445</td>
      <td>588.710175</td>
      <td>4514.209184</td>
      <td>7.950000</td>
      <td>5</td>
      <td>8</td>
      <td>23.841944</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1</td>
      <td>0.804670</td>
      <td>2</td>
      <td>5.0</td>
      <td>0.00</td>
      <td>585.344614</td>
      <td>4509.712541</td>
      <td>585.843967</td>
      <td>4509.545089</td>
      <td>4.950000</td>
      <td>5</td>
      <td>29</td>
      <td>15.831389</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1</td>
      <td>3.653202</td>
      <td>1</td>
      <td>10.0</td>
      <td>1.10</td>
      <td>585.422062</td>
      <td>4509.477536</td>
      <td>583.671081</td>
      <td>4507.735573</td>
      <td>11.066667</td>
      <td>5</td>
      <td>8</td>
      <td>2.098333</td>
    </tr>
    <tr>
      <th>9</th>
      <td>6</td>
      <td>1.625433</td>
      <td>1</td>
      <td>5.5</td>
      <td>1.36</td>
      <td>587.875433</td>
      <td>4514.931073</td>
      <td>587.701248</td>
      <td>4513.709691</td>
      <td>4.216667</td>
      <td>3</td>
      <td>13</td>
      <td>21.783056</td>
    </tr>
  </tbody>
</table>

### ❓️ הבעיה: מציאת חניונים

חברת מוניות רוצה לשכור $$K$$ מגרשי חניה ברחבי העיר NYC בהם יוכלו לחכות המוניות שלה בין הנסיעות.

לשם כך היא מעוניינת לבחור באופן אופטימאלי את המיקומים של מגרשי החניות האלו כך שהמרחק הממוצע מנקודת הורדת הנוסע למרגש החניה הקרוב יהיה מינימאלי.

#### שדות רלוונטיים

הפעם נתמקד בשתי השדות:

- **dropoff_easting** - הקואורדינאטה האורכית (מזרח-מערב) של סיום הנסיעה
- **dropoff_northing** - הקואורדינאטה הרוחבית (צפון-דרום) של סיום הנסיעה

(למתעניינים: הקואורדינאטות נתונות בUTM-WGS84, היחידות הן בקירוב קילומטר).

#### ויזואליזציה של נקודות ההורדה

![png](./media/dropoffs.png)

### הגדרה פורמאלית של הבעיה

נשתמש בסימונים הבאים:

- $$X$$ הוקטור האקראי של מיקום סיום הנסיעה
- $$\boldsymbol{c}_i$$: המיקום של מגרש החניה ה-$$i$$.
- $$N$$: מספר הנסיעות במדגם.

המטרה: למצוא את מיקומי החניונים האופטימאליים אשר ממזערים את:

$$
R\left(\left\lbrace\boldsymbol{c}_i\right\rbrace\right)=\mathbb{E}\left[\min_{i}\left\lVert\boldsymbol{x}-\boldsymbol{c}_i\right\rVert\right]
$$

מכיוון שאנו לא יודעים את הפילוג של $$X$$ נחליף את התוחלת על $$X$$ בתוחלת האמפירית

$$
\hat{R}\left(\left\lbrace\boldsymbol{c}_i\right\rbrace\right)=\frac{1}{N}\sum_{j}\min_{i}\left\lVert\boldsymbol{x}_j-\boldsymbol{c}_i\right\rVert
$$

את הבעיה שקיבלנו ניתן לרשום כבעיית אשכול. נגדיר את האשכול $$G_i$$, כאוסף כל הנסיעות שהחניון ה$$i$$ הוא הקרוב ביותר לנקודת הסיום שלהן. באופן זה נוכל לרשום את הפונקציית המטרה שלנו באופן הבא:

$$
\hat{R}\left(\left\lbrace\boldsymbol{c}_i\right\rbrace\right)=\frac{1}{N}\sum_{i=1}^K\sum_{j\in G_i}\left\lVert\boldsymbol{x}_j-\boldsymbol{c}_i\right\rVert
$$

### פתרון באמצעות K-Means

נשים לב כי הבעיה שקיבלנו דומה מאד לבעיה אותה K-Means מנסה לפתור, עם הבדל משמעותי אחד. K-Means ממזער את המרחק ה**ריבועי** הממוצע בעוד שאנו מחפשים למזער את המרחק האוקלידי. ישנם אלגוריתמים מורכבים יותר אשר פותרים את הבעיה שלנו, אך לבינתיים נשאר עם K-Means.

*נציין שזהו מצב נפוץ שבו איננו מסוגלים לפתור בעיה מסויימת באופן ישיר אז אנו פותרים בעיה דומה לה בתקווה לקבל תוצאות מספקות, אך לא בהכרח אופטמאליות.*

#### ✍️ תרגיל 4.2

1) השתמשו באלגוריתם K-Means על מנת לבחור את המיקום של 10 מגרשי חניה.

2) חשבו את ה- Empirical Risk.

#### 💡 פתרון

תוצאות ההרצה המתקבלות:

![png](./media/k_means.png)

המרחק נסיעה הממוצע המתקבל הינו 700 מ'.

#### ✍️ תרגיל 4.3

1) ציינו שתי סיבות מדוע המיקומים שקיבלנו הם לא בהכרח אופטימאליים

2) הציעו דרכים לשפר את התוצאות על סמך הסיבות מסעיף הקודם.

#### 💡 פתרון

שתי סיבות לחוסר אופטימאליות והצעות לשיפור:

1) K-Mean לא מבטיח התכנסות למינימום הגלובלי. דרך אחת לשפר את תוצאות האלגוריתם הינה להריץ אותו מספר פעמים עם איתחולים שונים.

2) כפי שציינו קודם K-Mean ממזערת את השגיאה הריבועית הממוצעת. ניתן אם כן לשפר קלות את התוצאות על ידי שמירה על האשכולות אך תיקון המרכז לנקודה אשר ממזערת את המרחק עצמו.

**הערה** הנקודה אשר ממזערת את המרחק עצמו בינה לבין כל שאר הנקודות באשכול נקראת החציון הגיאומטרי *The Geometric Median* ([wiki](https://en.wikipedia.org/wiki/Geometric_median)). ניתן למצוא נקודה זו על ידי שימוש באלגוריתם המוכונה *Weiszfeld's algorithm*.

## ❓️ בעיה 2: מציאת מספר החניונים האופטימאלי

עד כה השתמשנו ב10 חניונים, נרצה כעת לבחור גם מספר זה בצורה מיטבית. באופן כללי ככל שנגדיל את מספר החניונים מרחק הנסיעה לחניונים יקטן, אך מנגד התחזוקה של כל חניון עולה כסף.

נניח כי:

1. עלות האחזקה של חניון הינה 10k$ לחודש.
2. בכל חודש יהיו בדיוק 100k נסיעות.
3. עלות הנסיעה של מונית בדרך לחניון הינה 3$ לקילומטר.

#### ✍️ תרגיל 4.4

1. תחת ההנחות, נסחו את פונקציית הסיכון שמתאימה לעלות אחזקת והפעלת מגרשי חניה.
2. ​     השתמשו באלגוריתם K-Means ומצאו את ערך ה-K האופטימלי באמצעות  Grid search עבור K בין 1 ל-25.

#### 💡 פתרון

נרשום תחת הנחות אלו את העלות החודשית של אחזקת החניונים והנסיעה אליהם:

$$
R\left(\left\lbrace\boldsymbol{c}_i\right\rbrace, K\right)= 10\cdot K+100\cdot3\cdot\mathbb{E}\left[\min_{j}\left\lVert\boldsymbol{x}-\boldsymbol{c}_j\right\rVert\right]
$$

והמקבילה האמפירית:

$$
\hat{R}\left(\left\lbrace\boldsymbol{c}_i\right\rbrace, K\right)= 10\cdot K+300\cdot\frac{1}{N}\sum_{i=1}^K\sum_{j\in G_i}\left\lVert\boldsymbol{x}_j-\boldsymbol{c}_i\right\rVert
$$

### מספר החניונים כHyper parameter

כעת עלינו לבצע אופטימיזציה גם על מספר החניונים וגם המיקום שלהם. ראינו כיצד ניתן למצוא פתרון בעבור $$K$$ נתון, אך אין לנו דרך פשוטה להכליל את זה ל$$K$$ כלשהו. כן נוכל אבל לעבור על כל ערכי $$K$$ הרלוונטים, לפתור את הבעיה עבורם ולבסוף לקחת את הפתרון הטוב ביותר.

מקרה זה, שבו יש בידינו שיטה יעילה למצוא את הפתרון האופטימאלי רק אחרי שקיבענו חלק מהפרמטרים, הינו מקרה נפוץ. את אותם פרמטרים שאין לנו שיטה יעילה לבחור אותם אנו מכנים לרוב ה**Hyper-parameters** של המודל. שני hyper-parameters בהם כבר נתקלנו בקורס הינם:

- מספר ורוחב התאים של היסטוגרמה
- רוחב וסוג הגרעין בKDE

לרוב נאלץ לבחור את ערכם של הhyper-parameters על ידי:

1. חיפוש על גריד (grid search) או מעבר על כל האפשרויות (brute force).
2. ניסוי וטעיה. כאשר לרוב נתחיל מאיזשהו ניחוש מושכל.

### פתרון באמצעות K-Means וסריקת על K.

נריץ את אלגוריתם הK-Means בעבור כל ערך של $$K$$ בתחום $$1\leq K \leq 25$$, נשרטט את עלות הנסיעה, עלות אחזקת החניונים והעלות הכוללת:

![png](./media/scan_for_k.png)

נקבל כי:

- מספר החניונים האופטימאלי הינו: 12.
- מרחק הנסיעה הממוצע יהיה 630 מ'.
- העלות הכוללת תהיה 308.12k$ לחודש.

-->

</div>
