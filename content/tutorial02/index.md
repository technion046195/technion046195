---
type: tutorial
index: 2
template: page
make_docx: true
print_pdf: true
---

<div dir="rtl" class="site-style">

# תרגול 2 - רגרסיה לינארית

<div dir="ltr">
<a href="/assets/tutorial02.pdf" class="link-button" target="_blank">PDF</a>
<a href="./code/" class="link-button" target="_blank">Code</a>
</div>

## תקציר התיאוריה

### למידה מונחית

#### הגדרה

- נתונים שני משתנים אקראיים $\text{x}$ ו $\text{y}$ בעלי פילוג לא ידוע.
- נתון לנו **מדגם** של זוגות של $\text{x}$ ו $\text{y}$ אשר יוצרו מ $N$ דגימות בלתי תלויות:

$$
\mathcal{D}=\{x^{(i)}, y^{(i)}\}_{i=1}^N
$$

- נסמן ב $\hat{y}=h(x)$ חזאיים אפשריים של $\text{y}$ בהינתן $\text{x}$.
- נתונה לנו **פונקציית מחיר** $C(h)$ אשר מחשבת מחיר לכל חזאי. ($C$ יכול להיות תלוי בפילוג).
- נרצה למצוא את החזאי $h^*$ עם המחיר הנמוך ביותר.

##### הערות

- את המשתנים $\text{y}$ מקובל לכנות **labels** (תגיות).
- את המשתנים $\text{x}$ מקובל לכנות **observations \ measurements** (תצפיות / מדידיות).
- גם $\text{x}$ וגם $\text{y}$ יכולים להיות וקטורים או סקלרים. המקרה הנפוץ הינו ש $\mathbf{x}$ הוא וקטור ו $\text{y}$ סקלר.

#### רישום כבעיית אופטימיזציה

את הבעיה של מציאת החזאי האופטימאלי ניתן לרשום כ:

$$
h^* = \underset{h}{\arg\min} C(h)
$$

**בעיה**: לרוב, פונקציית המחיר $C$ תהיה תלויה בפילוג הלא ידוע. לשם כך נאלץ להשתמש במדגם כתחליף לפילוג הלא ידוע. במהלך הקורס נכיר כמה שיטות לעשות זאת.

#### אבחנה בין שני מקרים

מקובל לחלק את הבעיות בלמידה מונחית לשתי קטגוריות:

**בעיות רגרסיה** - המקרה בו $\text{y}$ הוא משתנה רציף.

**בעיות סיווג** - המקרה בו $\text{y}$ הוא משתנה בדיד המקבל סט סופי של ערכים.

(בעיקרון יכולות להיות גם בעיות בהן $\text{y}$ בדיד ולא סופי. בבעיות מסוג זה לרוב פשוט מניחים ש$\text{y}$ רציף והופכים את הבעיה לבעיית רגרסיה)

### פונקציות הפסד וסיכון

דרך נפוצה להגיד את פונקציית המחיר היא כתוחלת על פונקציית הפסד באופן הבא:

- נגדיר פונקציה $l$ אשר מחשבת לחיזוי בודד גודל המכונה **loss** (הפסד).<br/>
  זאת אומרת שבעבור דגימה בודדת, עם ערכי $\boldsymbol{x}$ ו $y$ כל שהם, ועם תוצאת חיזוי $\hat{y}=h(\boldsymbol{x})$. ההפסד מוגדרת להיות:

  $$
  l(\hat{y},y)=l(h(x),y)
  $$

- בעזרת פונקציית הloss ניתן להגדיר את פונקציית המחיר כתוחלת של ההפסד על פני הפילוג של $\mathbf{x}$ ו $\text{y}$:

  $$
  C(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
  $$

במקרים כאלה, מוקבל לכנות את פונקציית המחיר, פונקציית ה**risk** (סיכון), ולסמנה באות $R$:

$$
  R(h)=\mathbb{E}\left[l(h(\mathbf{x}),\text{y})\right]
$$

### Empirical risk minimization (ERM)

אחת הדרכים הנפוצות לנסות ולהתמודד עם חוסר הידיעה של הפילוג, היא להחליף את התוחלת על הפילוג הלא ידוע, בתוחלת אמפירית על המדגם. התוחלת האימפרית מוגדרת כממוצע על פני אוסף של דגימות (במקרה שלנו על המדגם).<br/>
נסמן את התוחלת האימפירית על פני מדגם $\mathcal{D}$ ב $\hat{\mathbb{E}}_{\mathcal{D}}$, ואת הrisk האמפירי ב $\hat{R}_{\mathcal{D}}$:

$$
\hat{R}_{\mathcal{D}}(h)
=\hat{\mathbb{E}}_{\mathcal{D}}\left[l(h(\mathbf{x}),\text{y})\right]
=\frac{1}{N}\sum_{i=0}^Nl(h(\boldsymbol{x}^{(i)}),y^{(i)})
$$

בעיית האופטימיזציה תהיה במקרה זה:

$$
h^*_{\mathcal{D}} = \underset{h}{\arg\min} \frac{1}{N}\sum_{i=0}^Nl(h(\boldsymbol{x}^{(i)}),y^{(i)})
$$

שיטה זו מוכנה empirical risk minimization (ERM).

**שימו לב**: מכיוון שהתוחלת האמפירית היא רק קירוב של התוחלת האמיתית, הפתרון של בעיית ה ERM גם יהיה רק קירוב של הפתרון של הבעיה המקורית. זאת אומרת שבמקרה הכללי $h^*_{\mathcal{D}}\neq h^*$.

### מודלים פרמטריים

לרוב אנו נגביל את החיפוש של החזאי למשפחה מצומצמת של חזאים בעלי צורה קבועה עד כדי מספר סופי של פרמטרים. את הפרמטרים של המודל נסמן בעזרת הוקטור $\boldsymbol{\theta}$. אנו נשתמש ב $h(x;\boldsymbol{\theta})$ לתיאור של חזאי מהמשפחה עם פרמטרים $\boldsymbol{\theta}$.

דוגמא למשפחה פרמטרית:

$$
h(x;\boldsymbol{\theta})=\theta_1\cos(\theta_2 x)e^{-\theta_3 x}
$$

כאשר עובדים עם מודל פרמטרי, האופטימיזציה היא למעשה על על הפרמטרים, והבעיה הופכת להיות:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^Nl(h(\boldsymbol{x}^{(i)};\boldsymbol{\theta}),y^{(i)})
$$

#### מאפיינים

בהינתן מודל פרמטרי כל שהוא, ניתן בקלות לייצר מודלים פרמטרים חדשים על ידי ביצוע עיבוד מקדים כל שהוא ל $\boldsymbol{x}$ לפני שהוא מוזן למודל. את העיבוד המקדים ניתן לתאר כאוסף של פונקציות $\varphi_k$ אשר פועלות על $\boldsymbol{x}$. את המידע המעובד (המוצא של ה $\varphi$-ים) מקובל לכנות מאפיינים. כמו כן, לרוב נוח לאגד את כל הפונקציות $\varphi$ לפונקציה אחת $\Phi$ אשר פועלת על $\boldsymbol{x}$ ומחזירה את וקטור המאפיינים:

$$
\Phi(\boldsymbol{x})=
[\varphi_1(\boldsymbol{x}),\varphi_2(\boldsymbol{x}),\cdot,\varphi_M(\boldsymbol{x})]^{\top}
$$

המודל הפרמטרי החדש יהיה הרכבה של $h$ ו $\Phi$:

$$
h_{\text{new}}(\boldsymbol{x};\boldsymbol{\theta})
=h(\Phi(\boldsymbol{x});\boldsymbol{\theta})
$$

דרך אחרת להסתכל על המאפיינים הינה שאנו כביכול מחליפים את המדגם שקיבלנו במדגם חדש באופן הבא:

$$
\boldsymbol{x}_{\text{new}}=\Phi(\boldsymbol{x}_{\text{old}})
$$

### רגרסיה לינארית

רגרסיה לינארית עוסקת בבעיות רגרסיה שבהם המודל הינו **לינארי בפרמטרים שלו**. זאת אומרת, בעיות בהם המודל הינו מהצורה של:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 x_1+\theta_2 x_2+\dots+\theta_d x_d
=\boldsymbol{x}^{\top}\boldsymbol{\theta}
$$

כפי שציינו קודם, וכפי שנראה בתרגיל, תמיד ניתן להשתמש במאפיינים על מנת לקבל פונקציות מורכבות יותר:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1 \varphi_1(\boldsymbol{x})+\theta_2 \varphi_2(\boldsymbol{x})+\dots+\theta_M \varphi_M(\boldsymbol{x})
=\Phi(\boldsymbol{x})^{\top}\boldsymbol{\theta}
$$

#### Linear least squares (LLS)

מקרה מיוחד הוא המקרה שבו משתמשים במודל לינארי יחד עם risk עם loss ריבועי:

$$
l(\hat{y},y)=(\hat{y}-y)^2
$$

במקרה זה, מתקבל בעיית אופטימיזציה אשר ניתן לפתור אותה באופן אנליטי:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N(h(\boldsymbol{x}^{(i)};\boldsymbol{\theta})-y^{(i)})^2
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2
$$

##### כתיב מטריצי

בכדי לפתור את הבעיה, נוח יותר לרשום אותה בכתיב מטריצי.

- נגדיר את הוקטור $\boldsymbol{y}$ כוקטור של כל התגיות במדגם:

  $$
  \boldsymbol{y}=[y^{(1)},y^{(2)},\cdot,y^{(N)}]^{\top}
  $$

- נגדיר את המטריצה $X$ כמטריצה של כל ה$\boldsymbol{x}$-ים במדגם:

  $$
  X=\begin{bmatrix}
  - & \boldsymbol{x}^{(1)} & - \\
  - & \boldsymbol{x}^{(2)} & - \\
  & \vdots & \\
  - & \boldsymbol{x}^{(N)} & -
  \end{bmatrix}
  $$

בעזרת הגדרות אלו ניתן לרשום את בעיית האופטימיזציה של LLS באופן הבא:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
$$

##### הפתרון של LLS

את בעית האופטימיזציה הזו ניתן לפתור על ידי גזירה והשוואה ל-0, כפי שנעשה בתרגיל הראשון. הפתרון המתקבל הינו:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
$$

הפתרון הזה נכון כאשר $X^{\top}X$ הפיכה. תנאי הכרחי בכדי שזה יקרה הינו שמספר הדגימות $N$ יהיה גדול מהמימד של $\boldsymbol{x}$ (אשר נסמן כ $D$). כאשר המטריצה לא הפיכה יש לבעיה יותר מפתרון יחיד, כפי שנראה בהמשך.

(המטריצה $(X^{\top}X)^{-1}X^{\top}$ נקראת Moore-Penrose pseudo inverse)

##### הערה

כשאר משתמשים במאפיינים המטריצה $X$ תהיה:

$$
X=\begin{bmatrix}
- & \Phi(\boldsymbol{x}^{(1)}) & - \\
- & \Phi(\boldsymbol{x}^{(2)}) & - \\
& \vdots & \\
- & \Phi(\boldsymbol{x}^{(N)}) & -
\end{bmatrix}
$$

## תרגיל 2.1

הראו כי כאשר $X^{\top}X$ הפיך, הפתרון של בעיית האופטימיזציה של LLS:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2
$$

נתון על ידי:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
$$

### פתרון 2.1

נפתור על ידי גזירה והשוואה ל0:

$$
\begin{aligned}
\nabla_{\boldsymbol{\theta}}\left(\frac{1}{N}\lVert X\boldsymbol{\theta}-\boldsymbol{y}\rVert_2^2\right)&=0\\
\Leftrightarrow\nabla_{\boldsymbol{\theta}}\left((X\boldsymbol{\theta}-\boldsymbol{y})^{\top}(X\boldsymbol{\theta}-\boldsymbol{y})\right)&=0\\
\Leftrightarrow\nabla_{\boldsymbol{\theta}}(\boldsymbol{\theta}^{\top}X^{\top}X\boldsymbol{\theta}
                                -2\boldsymbol{y}^{\top}X\boldsymbol{\theta}+\lVert\boldsymbol{y}\rVert_2^2)&=0\\
\end{aligned}
$$

בכדי לחשב את הנגזרות נשתמש בשני הנזגרות המוכרות הבאות:

$$
\nabla_{\boldsymbol{x}}(\boldsymbol{a}^{\top}\boldsymbol{x})=\boldsymbol{a},
\qquad
\nabla_{\boldsymbol{x}}(\boldsymbol{x}^{\top}A\boldsymbol{x})=2A\boldsymbol{x}
$$

על ידי שימוש בנגזרות אלו נקבל

$$
\begin{aligned}
\Leftrightarrow\nabla_{\boldsymbol{\theta}}(\boldsymbol{\theta}^{\top}X^{\top}X\boldsymbol{\theta}
                                -2\boldsymbol{y}^{\top}X\boldsymbol{\theta}+\lVert\boldsymbol{y}\rVert_2^2)&=0\\
\Leftrightarrow2X^{\top}X\boldsymbol{\theta}
-2X^{\top}\boldsymbol{y}&=0\\
\Leftrightarrow X^{\top}X\boldsymbol{\theta}&=X^{\top}\boldsymbol{y}
\end{aligned}
$$

זוהי בעיה של פתרון מערכת משוואות לינארית מהצורה של $A\boldsymbol{x}=b$ כאשר:

$$
A=X^{\top}X,\qquad b=X^{\top}\boldsymbol{y}
$$

כאשר המטריצה $X^{\top}X$ הפיכה, הפתרון של בעיה זו נתון על ידי:

$$
\boldsymbol{\theta}=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
$$

כאשר היא אינה הפיכה ישנם מספר פתרונות (למעשה קיים מרחב לינארי של פתרונות אשר פותרים את הבעיה).

## תרגיל 2.2

נתונה לנו בעיית LLS עם המדגם הבא:

$$
\mathcal{D}=\{\{x^{(1)}=-1,y^{(1)}=2.5\},\{x^{(2)}=2,y^{(2)}=2\},\{x^{(3)}=4,y^{(3)}=1\}\}
$$

להבא בקורס, נשמיט את הרישום של $x$ ו $y$ בהגדרת המדגם ונרשום אותו בקצרה באופן הבא:

$$
\mathcal{D}=\{\{-1,2.5\},\{2,2\},\{4,1\}\}
$$

<div class="imgbox">

![](./output/ex_2_2_dataset.png)

</div>

**1)** נרצה כעת להשתמש במאפיינים בכדי לקבל מודל שהוא פונקציה לינארית (עם איבר היסט) ב$x$. רשמו את המאפיינים המתאימים ואת המודל המתקבל. מצאו את הפרמטרים של המודל האופטימאלי?

**2)** נרצה כעת להשתמש במאפיינים בכדי לקבל מודל שהוא פולינום מסדר 2 ב$x$. רשמו את המאפיינים ואת המודל המתקבל ומצאו את הפרמטרים של המודל האופטימאלי?

**3)** נרצה כעת להשתמש במאפיינים בכדי לקבל מודל שהוא פולינום מסדר 3 ב$x$. האם במקרה זה קיים פתרון יחיד? 
מצאו את הפתרונות למקרה שבו $\theta_1=0$ (איבר ההיסט מתאפס) ולמקרה שבו $\theta_3=0$ (המקדם של $x^2$ מתאפס)

**4)** נרצה כעת להשתמש בפונקציות המאפיינים הבאות:

$$
\varphi_m(x)=\exp\left(-\frac{(x-\mu_m)^2}{2\sigma_m^2}\right)\qquad m\in1,2,3
$$

כאשר

$$
\sigma_1=1.5,\sigma_2=\sigma_3=1\qquad \mu_1=-1,\mu_2=2,\mu_3=4
$$

חשבו את הפרמטרים של המודל האופטימאלי בעבור מאפיינים אלו.

**5)** בעבור כל אחד מהסעיפים חשבו את הסיכון האמפירי המתקבל. האם לדעתכם סיכון אמפירי קטן יותר בהכרח מעיד על סיכון (לא אמפירי) קטן יותר?

### פתרון 2.2

#### 1)

אנו מעוניינים במודל מהצורה:

$$
h(x;\boldsymbol{\theta})=\theta_1+\theta_2 x
$$

כפי שראינו בהרצאה, ניתן להוסיף את איבר ההיסט על ידי שימוש במאפיינים. אנו נעשה זאת על ידי שימוש במאפיינים הבאים:

$$
\varphi_1(x)=1,\quad\varphi_2(x)=x
$$

או בכתיב וקטורי

$$
\Phi(x)=[1,x]^{\top}
$$

פעולה זו למעשה פשוט מוסיפה את האיבר 1 ל$x$ וכביכול יוצר את המדגם הבא:

$$
\mathcal{D}=\{\{[1,-1]^{\top},2.5\},\{[1,2]^{\top},2\},\{[1,4]^{\top},1\}\}
$$

נרשום את $X$ ו $\boldsymbol{y}$:

$$
X=\begin{bmatrix}1&-1\\1&2\\1&4\end{bmatrix}
\qquad
\boldsymbol{y}=\begin{bmatrix}2.5\\2\\1\end{bmatrix}
$$

הפרמטרים האופטימאליים של המודל אשר ממזערים את הסיכון האמפירי יהיו אם כן:

$$
\begin{aligned}
\boldsymbol{\theta}^*_{\mathcal{D}}
&=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}\\
&=\left(\begin{bmatrix}1&1&1\\-1&2&4\end{bmatrix}
        \begin{bmatrix}1&-1\\1&2\\1&4\end{bmatrix}\right)^{-1}
   \begin{bmatrix}1&1&1\\-1&2&4\end{bmatrix}
   \begin{bmatrix}2.5\\2\\1\end{bmatrix}\\
&=\left(\begin{bmatrix}3&5\\5&21\end{bmatrix}\right)^{-1}
   \begin{bmatrix}5.5\\4.5\end{bmatrix}
=\frac{1}{38}\begin{bmatrix}21&-5\\-5&3\end{bmatrix}
   \begin{bmatrix}5.5\\4.5\end{bmatrix}\\
&=\frac{1}{38}\begin{bmatrix}88\\-11\end{bmatrix}
=\begin{bmatrix}2.3158\\-0.2895\end{bmatrix}
\end{aligned}
$$

מכאן שהמודל שלנו הינו:

$$
h(x)=2.3158-0.2895 x
$$

<div class="imgbox">

![](./output/ex_2_2_1.png)

</div>

#### 2)

בדומה לסעיף הקודם נבחר את פונקציות המאפיינים הבאות:

$$
\Phi(x)=[1,x,x^2]^{\top}
$$

על מנת לקבל את המודל הבא:

$$
h(x;\boldsymbol{\theta})=\theta_1+\theta_2 x+\theta_3 x^2
$$

לאחר הפעלת פונקציות המאפיינים נקבל את המדגם הבא:

$$
\mathcal{D}=\{\{[1,-1,1]^{\top},5\},\{[1,2,4]^{\top},2\},\{[1,4,16]^{\top},1\}\}
$$

הוקטור $\boldsymbol{y}$ אינו מושפע מבחירת המאפיינים, אך המטריצה $X$ תהיה כעת:

$$
X=\begin{bmatrix}1&-1&1\\1&2&4\\1&4&16\end{bmatrix}
$$

וקטור הפרמטרים המתקבל הינו: (את זה כבר עדיף לחשב במחשב)

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
=\frac{1}{30}[74,-3,-2]^{\top}
=[2.467,-0.1,-0.067]^{\top}
$$

<div class="imgbox">

![](./output/ex_2_2_2.png)

</div>

#### 3)

נבחר את פונקציות המאפיינים הבאות:

$$
\Phi(x)=[1,x,x^2,x^3]^{\top}
$$

המטריצה $X$ תהיה כעת:

$$
X=\begin{bmatrix}1&-1&1&-1\\1&2&4&8\\1&4&16&64\end{bmatrix}
$$

כיוון שלמטריצה $X$ יש יותר עמודות משורות (יש יותר פרמטרים מדגימות) המטריצה $X^{\top}X$ בהכרח לא תהיה הפיכה. ולכן כפי שציינו קודם יהיו לבעיה הרבה פתרונות. (ניתן להראות כי המטריציה לא הפיכה לפי העובדה שלא יכולים להיות ב $X^{\top}X$ יותר מ3 שורות בלתי תלויות ולכן המימד שלה הוא לכל היותר 3)

נסתכל על שני המקרים הפרטיים $\theta_1=0$ ו $\theta_3=0$.

##### $\theta_1=0$

במקרה זה המודל הפרמטרי מתנוון ל:

$$
h(x;\boldsymbol{\theta})=\theta_2 x+\theta_3 x^2+\theta_4 x^3
$$

אנו למעשה יכולים לפתור את זה כבעיית LLS עם וקטור פרמטריים $\boldsymbol{\theta}=[\theta_2,\theta_3,\theta_4]^{\top}$ ומאפיינים:

$$
\Phi(x)=[x,x^2,x^3]^{\top}
$$

המטריצה $X$ תהיה:

$$
X=\begin{bmatrix}-1&1&-1\\2&4&8\\4&16&64\end{bmatrix}
$$

והפתרון שיתקבל יהיה:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
=\frac{1}{120}[-86,177,37]^{\top}
=[-0.7167,1.475,-0.3083]^{\top}
$$

<div class="imgbox">

![](./output/ex_2_2_3_1.png)

</div>

##### $\theta_3=0$

במקרה השני, המודל הפרמטרי מתנוון ל:

$$
h(x;\boldsymbol{\theta})=\theta_1 + \theta_2 x+\theta_4 x^3
$$

המטריצה $X$ תהיה:

$$
X=\begin{bmatrix}1&-1&-1\\1&2&8\\1&4&64\end{bmatrix}
$$

והפתרון שיתקבל יהיה:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
=\frac{1}{150}[354,-19,-2]^{\top}
=[2.36,-0.1267,-0.0133]^{\top}
$$

<div class="imgbox">

![](./output/ex_2_2_3_2.png)

</div>

#### 4)

העובדה שהמאפיינים הם לא חזקות של $x$ לא משנה דבר. נפתור את הבעיה באופן דומה לסעיפים הקודמים:

בעבור המאפיינים:

$$
\varphi_1(x)=\exp\left(-\frac{(x+1)^2}{2\cdot1.5^2}\right)
\quad,
\varphi_2(x)=\exp\left(-\frac{(x-2)^2}{2}\right)
\quad,
\varphi_3(x)=\exp\left(-\frac{(x-4)^2}{2}\right)
$$

המטריצה $X$ תהיה:

$$
X=\begin{bmatrix}1&0.0111&3.7\times10^-6\\0.1353&1&0.1353\\0.0039&0.1353&1\end{bmatrix}
$$

והפתרון שיתקבל יהיה:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=(X^{\top}X)^{-1}X^{\top}\boldsymbol{y}
=[2.4827,1.5585,0.7794]^{\top}
$$

<div class="imgbox">

![](./output/ex_2_2_4.png)

</div>

המודל הלינארי הוא פשוט קומבינציה ליניארית של פונקציות של $\mathbf{x}$. לשם המחשה נראה כיצד התוצאה שהתקבלה היא למעשה קומבינציה לינארית של שלושת הגאוסיאנים של המאפיינים:

<div class="imgbox">

![](./output/ex_2_2_4_decomp.png)

</div>

#### 5)

נציג על גרף אחד את כל התוצאות שהתקבלו עד כה:

<div class="imgbox">

![](./output/ex_2_2_all.png)

</div>

מלבד במקרה הלינארי, קיבלנו בכל המודלים שגיאה אמפירית 0.

**הסבר**: אנו למעשה מנסים למצוא וקטור פרמטרים כך ש $X\boldsymbol{\theta}$ יהיה כמה שיותר קרוב ל$\boldsymbol{y}$. כאשר יש יותר פרמטרים מדגימות ניתן תמיד (עד כדי מקרים שבהם יש תלויות לינאריות בין המאפיינים או הדגימות) למצוא וקטור $\boldsymbol{\theta}$ כך שלבעיה הלינארית $X\boldsymbol{\theta}=\boldsymbol{y}$ יהיה פתרון (מצב של יותר נעלמים ממשואות).

לגבי סיכון האמיתי, ללא מידע נוסף על הבעיה לא ניתן לדעת איזה מודל יכליל בצורה טובה יותר (יעבוד טוב יותר על דוגמאות לא מדגם), וכמובן שאין כל הכרח שמודלים עם שגיאה האמפירית הקטנה יותר יכלילו טוב יותר.

##### ניחושים

אנחנו כן נוכל לנסות להשתמש בניסיון שלנו מתכונות כלליות של מודלים בעולם האמיתי על מנת לשער איזה מודל יכליל טוב יותר. לדוגמא, הינו מצפים שהמודל לא "ישתולל", זאת אומרת שערכים קרובים של $x$ יתנו ערכים יחסית דומים של $y$. מה שלא קורה במודל הראשון מסעיף 3 (הגרף האדום). ניתן לדוגמא לשער שהמודל הלינארי, שלא מניב שגיאה אמפירית של 0, יכליל בצורה טובה יותר מהמודל האדום.

בתרגול וההרצאה הקרובים, ננסה להשתמש בכלי בשם רגולריזציה בכדי לתרגם את הדרישה שהמודל לא "ישתולל" לדרישה מתמטית על מודל.

## תרגיל 2.3

בעבור וקטור אקראי $\mathbf{x}$ באורך 2, $\mathbf{x}=(\text{x}_1,\text{x}_2)^{\top}$ (או בכתיב מתמטי $\mathbf{x}\in\mathbb{R}^2$), מהם המאפיינים בהם יש להשתמש על מנת לקבל פולינום מסדר 2 בערכים של $\mathbf{x}$

### פתרון 2.3

אנו מעוניינים במודל מהצורה:

$$
h(\boldsymbol{x};\boldsymbol{\theta})=\theta_1
                                       +\theta_2 x_1
                                       +\theta_3 x_2
                                       +\theta_4 x_1x_2
                                       +\theta_5 x_1^2
                                       +\theta_6 x_2^2
$$

נוכל לייצר זאת על ידי בחירה של המאפיינים הבאים:

$$
\Phi(\boldsymbol{x})=[1,x_1,x_2,x_1x_2,x_1^2,x_2^2]^{\top}
$$

## תרגיל 2.4

נסתכל כעת על בעיית רגרסיה של מודל לינארי כללי $h(\boldsymbol{x};\boldsymbol{\theta})=\boldsymbol{x}^{\top}\boldsymbol{\theta}$ ופנקציית סיכון עם הפסד של $l_3$:

$$
l(\hat{y},y)=|\hat{y}-y|^3
$$

**1)** רשמו את בעיית האופטימיזציה של ERM.

**2)** האם ניתן לפתור בעיה זו בעזרת גזירה והשוואה ל0?

**3)** בעבור פתרון בעזרת gradient descent, רשמו את כלל העדכון של אלגוריתם (עם צעד גרדיאנט $\eta$).

### פתרון 2.4

#### 1)

בעיית האופטימיזציה שיש לפתור הינה:

$$
\begin{aligned}
\boldsymbol{\theta}^*_{\mathcal{D}}
&=\underset{\boldsymbol{\theta}}{\arg\min} \hat{R}_{\mathcal{D}}(h(\cdot;\boldsymbol{\theta}))\\
&=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N l(h(\boldsymbol{x}^{(i)};\boldsymbol{\theta}),y^{(i)})\\
&=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N|\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)}|^3
\end{aligned}
$$

#### 2)

נחשב את הנגזרת של פונקציית הסיכון האמפירי:

$$
\begin{aligned}
\nabla_{\boldsymbol{\theta}}\hat{R}_{\mathcal{D}}(h(\cdot;\boldsymbol{\theta}))
&=\nabla_{\boldsymbol{\theta}}\left(\frac{1}{N}\sum_{i=0}^N|\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)}|^3\right)\\
&=\frac{1}{N}\sum_{i=0}^N\nabla_{\boldsymbol{\theta}}|\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)}|^3\\
&=\frac{1}{N}\sum_{i=0}^N\nabla_{\boldsymbol{\theta}}\left(
    (\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^3\text{sign}(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})
    \right)\\
&=\frac{1}{N}\sum_{i=0}^N 3\boldsymbol{x}^{(i)}
    (\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})^2\text{sign}(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}-y^{(i)})\\
\end{aligned}
$$

כנראה שלא ניתן להשוות ביטוי זה ל-0 ולפתור אותו באופן אנליטי.

#### 3)

תזכורת, אלגוריתם הגרדיאט מנסה למצוא מינימום לוקאלי על ידי התקדמות בכיוון ההפוך מהגרדיאנט של פונקציית המטרה (שאותה רוצים למזער). הוא עושה זאת בעזרת סדרה של צעדים באופן הבא:

$$
\boldsymbol{\theta}^{(t+1)}=\boldsymbol{\theta}^{(t)}-\eta \nabla_{\boldsymbol{\theta}}f(\boldsymbol{\theta}^{(t)})
$$

(הפרמטר $\eta$ משפיע על גודל הצעד)

במקרה שלנו צעד העדכון של האלגוריתם יהיה:

$$
\begin{aligned}
\boldsymbol{\theta}^{(t+1)}
&=\boldsymbol{\theta}^{(t)}-\eta \nabla_{\boldsymbol{\theta}}\hat{R}(h(\cdot;\boldsymbol{\theta}^{(t)}))\\
&=\boldsymbol{\theta}^{(t)}-\eta \frac{1}{N}\sum_{i=0}^N 3\boldsymbol{x}
    (\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}^{(t)}-y^{(i)})^2\text{sign}(\boldsymbol{x}^{(i)\top}\boldsymbol{\theta}^{(t)}-y^{(i)})\\
\end{aligned}
$$

## דוגמא מעשית - חיזוי זמן נסיעה של מוניות בניו יורק

<div dir="ltr">
<a href="./example/" class="link-button" target="_blank">Code</a>
</div>

### מדגם נסיעות המונית בעיר New York

כחלק מהמאמץ של העיר New York להנגיש לציבור את המידע אותו היא אוספת, עריית NYC מפרסמת בכל חודש את הפרטים של כל נסיעות המונית אשר בוצעו בעיר באותו חודש. בקורס זה, אנו נעשה שימוש ברשימת הנסיעות מחודש ינואר 2016. ניתן למצוא את הרשימה, [פה](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page).

הרשימה המלאה כוללת מעל 10 מליון נסיעות, בכדי לקצר את זמן החישוב, אנו נעשה שימוש רק ברשימה חלקית הכוללת רק 100 אלף נסיעות (אשר נבחרו באקראי אחרי ניקוי מסויים של הרשימה). את הרשימה החלקית ניתן למצוא [פה](/datasets/nyc_taxi_rides.csv)

### המדגם ושדותיו

בטבלה מלטה מוצגים עשרת השורות הראשונות ברשימה

|    |   passenger count |   trip distance |   payment type |   fare amount |   tip amount |   pickup easting |   pickup northing |   dropoff easting |   dropoff northing |   duration |   day of week |   day of month |   time of day |
|---:|------------------:|----------------:|---------------:|--------------:|-------------:|-----------------:|------------------:|------------------:|-------------------:|-----------:|--------------:|---------------:|--------------:|
|  0 |                 2 |        2.76806  |              2 |           9.5 |         0    |          586.997 |           4512.98 |           588.155 |            4515.18 |   11.5167  |             3 |             13 |      12.8019  |
|  1 |                 1 |        3.21868  |              2 |          10   |         0    |          587.152 |           4512.92 |           584.85  |            4512.63 |   12.6667  |             6 |             16 |      20.9614  |
|  2 |                 1 |        2.57494  |              1 |           7   |         2.49 |          587.005 |           4513.36 |           585.434 |            4513.17 |    5.51667 |             0 |             31 |      20.4128  |
|  3 |                 1 |        0.965604 |              1 |           7.5 |         1.65 |          586.649 |           4511.73 |           586.672 |            4512.55 |    9.88333 |             1 |             25 |      13.0314  |
|  4 |                 1 |        2.46229  |              1 |           7.5 |         1.66 |          586.967 |           4511.89 |           585.262 |            4511.76 |    8.68333 |             2 |              5 |       7.70333 |
|  5 |                 5 |        1.56106  |              1 |           7.5 |         2.2  |          585.926 |           4512.88 |           585.169 |            4511.54 |    9.43333 |             3 |             20 |      20.6672  |
|  6 |                 1 |        2.57494  |              1 |           8   |         1    |          586.731 |           4515.08 |           588.71  |            4514.21 |    7.95    |             5 |              8 |      23.8419  |
|  7 |                 1 |        0.80467  |              2 |           5   |         0    |          585.345 |           4509.71 |           585.844 |            4509.55 |    4.95    |             5 |             29 |      15.8314  |
|  8 |                 1 |        3.6532   |              1 |          10   |         1.1  |          585.422 |           4509.48 |           583.671 |            4507.74 |   11.0667  |             5 |              8 |       2.09833 |
|  9 |                 6 |        1.62543  |              1 |           5.5 |         1.36 |          587.875 |           4514.93 |           587.701 |            4513.71 |    4.21667 |             3 |             13 |      21.7831  |


הרשימה כוללת מספר שדות (עמודות), אך בתרגול זה אנו נתמקד רק בשדות הבאים:

- **pickup_easting** - הקואורינאטה האורכית (מזרח-מערב) של נקודת האיסוף.
- **pickup_northing** - הקואורינאטה הרוחבית (צפון דרום) של נקודת האיסוף.
- **dropoff_easting** - הקואורינאטה האורכית של נקודת ההורדה.
- **dropoff_northing** - הקואורינאטה הרוחבית של נקודת ההורדה.
- **duration** - משך הנסיעה בדקות.

(למתעניינים, הקואורדינאטות נתונות בפרומט בשם WGS84-UTM שבהם הקואורדינטות הם ביחידות של בערך קילומטרים)

#### ויזואליצזיה של נקודות ההורדה

<div class="imgbox">

![](./output/pickups.png)

</div>

#### הפילוג של זמן הנסיעה

<div class="imgbox">

![](./output/duration_hist.png)

</div>

### הגדרה של הבעיה

בדוגמא זו ננסה לחזות את משך הנסיעה על פי נקודת האיסוף ונקודת ההורדה (הנקודות של תחילת הנסיעה וסיום הנסיעה). נסמן את המשתנה האקראי של משך הנסיעה ב $\text{y}$ ואת ארבעת המשתנים של האיסוף וההורדה ב $\mathbf{x}$:

$$
\mathbf{x}=[\text{x}_{\text{pick east}},
            \text{x}_{\text{pick north}},
            \text{x}_{\text{drop east}},
            \text{x}_{\text{drop north}}]^{\top}
$$

בתור פונקציית מחיר ניקח פונקציית סיכון עם הפסד ריבועי:

$$
R(h)=\mathbb{E}\left[(h(\mathbf{x})-\text{y})^2\right]
$$

בתרגול זה נסתפק בלנסות למצוא את מודל אשר ימזער את הסיכון האמפירי

$$
h^*_{\mathcal{D}}
=\underset{h}{\arg\min} \hat{R}_{\mathcal{D}}(h)
=\underset{h}{\arg\min} \frac{1}{N}\sum_{i=0}^N(h(\boldsymbol{x}^{(i)})-y^{(i)})^2
$$

בתרגול הבא ננסה לשפר את הבחירה של המודל כך שהוא גם יוכל להכליל טוב יותר. כמו כן, בתרגול זה נשתמש במודל לינארי לפונקציית החיזוי:

$$
h(\boldsymbol{x};\boldsymbol{\theta})
=\Phi(\boldsymbol{x})^{\top}\boldsymbol{\theta}
$$

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=\underset{\boldsymbol{\theta}}{\arg\min} \frac{1}{N}\sum_{i=0}^N(h(\boldsymbol{x}^{(i)};\boldsymbol{\theta})-y^{(i)})^2
$$

#### בחירת מאפיינים - נסיון ראשון

נתחיל בלנסות להשתמש במאפיין בודד. מכיוון שאנו מצפים שהדבר שהכי ישפיע על זמן הנסיעה הינו המרחק שאותו יש ליסוע, ננסה להשתמש במרחק האווירי בין נקודת האיסוף לנקודת ההורדה כמאפיין שלנו:

$$
\varphi_{\text{dist}}(\boldsymbol{x})=\sqrt{
(\text{x}_{\text{pick east}}-\text{x}_{\text{drop east}})^2
+(\text{x}_{\text{pick north}}-\text{x}_{\text{drop north}})^2}
$$

והמודל הלינארי יהיה:

$$
h(\boldsymbol{x};\theta)
=\theta\varphi_{\text{dist}}(\boldsymbol{x})
=\theta\sqrt{
(\text{x}_{\text{pick east}}-\text{x}_{\text{drop east}})^2
+(\text{x}_{\text{pick north}}-\text{x}_{\text{drop north}})^2}
$$

זאת אומרת שהחיזוי שלנו יהיה פונקציה לינארית (ללא היסט) של המרחק האווירי בין נקודת האיסוף להורדה.

##### מציאת הפרמטר של המודל

לפני שנחשב את הפרמטר נציג את התלות בין המרחק האווירי ומשך הנסיעה

<div class="imgbox">

![](./output/duration_vs_dist.png)

</div>

ניתן לראות שישנו פיזור גדול ושהנקודות לא יושבות קרוב לקו ליניארי, אך עם זאת, ניתן לראות כי ישנה מגמה כללית של הנקודות. אנו נקווה שהמודל הליניארי ינסה ללמוד מגמה זו.

נחשב את הפרמטר של המודל מתוך הנוסחא:

$$
\boldsymbol{\theta}^*_{\mathcal{D}}
=(X^{\top}X)^{-1}X\boldsymbol{y}
$$

כאשר $X$ הוא הוקטור של המאפיין היחיד $\varphi_{\text{dist}}$

$$
X = [\varphi_{\text{dist}}(\boldsymbol{x}^{(1)}),\varphi_{\text{dist}}(\boldsymbol{x}^{(2)}),\dots,\varphi_{\text{dist}}(\boldsymbol{x}^{(N)})]^{\top}
$$

הפרמטר המתקבל מחישוב זה הינו:

$$
\theta=4.23
$$

זאת אומרת שתחת המודל הלינארי החיזוי של זמן הנסיעה שווה למרחק האווירי אותו יש לעבור כפול $4.23$.

נוסיף את המודל הלינארי על גבי הגרף הקודם:

<div class="imgbox">

![](./output/duration_vs_dist_pred.png)

</div>

אכן המודל הלינארי למד את המגמה הכללית של הנקודות.

נחשב את הסיכון האמפירי המתקבל בעבור מודל זה:

$$
\hat{R}_{\mathcal{D}}(h)=\frac{1}{N}\sum_{i=0}^N(h(\boldsymbol{x}^{(i)})-y^{(i)})^2=32.67\text{min}^2
$$

#### בחירת מאפיינים - נסיון שני

ננסה להוסיף למודל עוד מאפיינים. ננסה להוסיף למודל פולינום מסדר שני של נקודת האיסוף תחת ההנחה שיש איזורים עמוסים יותר ואיזורים עמוסים פחות בעיר. המודל שלנו כעת יהיה:

$$
\begin{aligned}
h\left(\boldsymbol{x};\boldsymbol{\theta}\right)
=&\theta_1\sqrt{
(\text{x}_{\text{pick east}}-\text{x}_{\text{drop east}})^2
+(\text{x}_{\text{pick north}}-\text{x}_{\text{drop north}})^2}\\
&+ \theta_2 + \theta_3 x_{\text{pick east}}  + \theta_4 x_{\text{pick north}} \\
&+ \theta_5 x_{\text{pick east}}x_{\text{pick north}}
+ \theta_6 x_{\text{pick east}}^2 + \theta_7 x_{\text{pick north}}^2
\end{aligned}
$$

מכיוון שמדובר בכמות גדולה של מאפיינים כבר לא ניתן להציג את הנתונים ופונקציית החיזוי בגרף.

חישוב של הפרמטרים והסיכון האמפירי בשיטה דומה לקודם נותנת סיכון אמפירי של:

$$
\hat{R}_{\mathcal{D}}(h)=\frac{1}{N}\sum_{i=0}^N(h(\boldsymbol{x}^{(i)})-y^{(i)})^2=26.42\text{min}^2
$$

### עוד מאפיינים

ניתן להמשיך באופן דומה ולהוסיף עוד ועוד מאפיינים. לרוב, כל הוספה של מאפיין תקטין את השגיאה האפירית. בתרגול ובהרצאה הקרובים נעסוק בבעיתיות של הוספת כמות גדולה מידי של מאפיינים ונדבר על דרכים כיצד לעשות זאת באופן מבוקר.

</div>
