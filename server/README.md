# Серверная часть приложения для чтения журналов

Связи сущностей описаны в файле journal_db_diagram.drawio

Если Вы захотите собирать приложение без Docker, то настройки базы данных можно найти в файле ```/server/src/app-data-source.ts```

Настройки по умолчанию:
```
...
    host: "localhost",
    port: 5432,
    username: "osla",
    database: "journal_db",
    password: "1234",
...
```

Путь к **файлам**: /server/public
* обложки в <название журнала>/cover.jpg
* страницы в <название журнала>/<порядковый номер главы>/<порядковый номер страницы>.jpg

Доступ к папке public осуществляется через адрес хоста сервера

# API

<b>http://<host\>/api/</b>

Порт находится в .env файле (5001)
<br>

#### /users

* <b style="color: orange; ">POST</b> <b>/registration</b>

    <table>
    <tbody>
    <tr>
    <td style="width: 200px;">Request body</td>
    <td style="width: 400px;">
    <p>username: string</p>
    <p>email: string</p>
    <p>password: string</p>
    <p>is_admin: boolean(false)</p>
    </td>
    </tr>
    <tr>
    <td>Response</td>
    <td>jwt-token: string</td>
    </tr>
    </tbody>
    </table>

* <b style="color: orange; ">POST</b> <b>/login</b>

    <table>
    <tbody>
    <tr>
    <td style="width: 200px;">Request body</td>
    <td style="width: 400px;">
    <p>email: string</p>
    <p>password: string</p>
    </td>
    </tr>
    <tr>
    <td>Response</td>
    <td>jwt-token: string</td>
    </tr>
    </tbody>
    </table>

* <b style="color: green; ">GET</b> <b>/find</b>

    <table>
    <tbody>
    <tr>
    <td style="width: 200px;">Request query</td>
    <td style="width: 400px;">id: string</td>
    </tr>
    <tr>
    <td>Response</td>
    <td>id: number<br /> is_admin: boolean<br /> username: string<br /> email: string<br /> password: string<br /> photo: string</td>
    </tr>
    </tbody>
    </table>

* <b style="color: green; ">GET</b> <b>/auth</b>

    <table>
    <tbody>
    <tr>
    <td style="width: 200px;">Request Headers</td>
    <td style="width: 400px;">
    <p>Authorization | jwt-token</p>
    </td>
    </tr>
    <tr>
    <td>Response</td>
    <td>jwt-token: string</td>
    </tr>
    </tbody>
    </table>
<br>

#### /journals

Genre entity:
```
{id: number, name: string}
```

Author entity:
```
{id: number, name: string}
```

Journal entity:
```
{
    id: number,
    status: string,
    description: string,
    year: number,
    genres: [Genres],
    authors: [Authors],
    chapters?: [Chapters],          // только при поиске конкретной главы
    number_of_chapters: number(0),
    createdAt: Date,                // "YYYY-MM-DDThr:mn:sc[.nnn]"
    updatedAt: Date                 // "YYYY-MM-DDThr:mn:sc[.nnn]"
}
```
<br>

**Поиск**

* <b style="color: green; ">GET</b> <b>/:id</b>
<table><tbody>
<tr>
<td style="width: 200px;">Response</td>
<td style="width: 400px;">
<p>journal?: Jornal</p>
</td>
</tr>
</tbody></table>  

* <b style="color: green; ">GET</b> <b>/</b>

<table><tbody>
<tr>
<td style="width: 200px;">Request query</td>
<td style="width: 400px;">
<p>page?: number (1)</p>
<p>limit?: number (9)</p>
</td>
</tr>
<tr>
<td>Response</td>
<td>JSON: [Journals]</td>
</tr>
</tbody></table>  

* <b style="color: orange; ">POST</b> <b>/filter</b>

<table><tbody>
<tr>
<td style="width: 200px;">Request body</td>
<td style="width: 400px;">
<p>page?: number (1)</p>
<p>limit?: number (9)</p>
<p>genres?: [names]</p>
<p>authors?: [names]</p>
<p>year?: number</p>
<p>upperYear?: number (верхний порог)</p>
<p>lowerYear?: number (нижний порог)</p>
<p style="color: #e2e2de">___________________________________________</p>
<p><i>если указан year, то пороги (в любом случае) будут изменены на его значение</i></p>
</td>
</tr>
<tr>
<td>Response</td>
<td>JSON: [Journals]</td>
</tr>
</tbody></table>

<br>

**Изменение**

* <b style="color: orange; ">POST</b> <b>/create</b>
    
<table>
<tbody>
<tr>
<td style="width: 200px;">Request body</td>
<td style="width: 400px;">
<p>title: string</p>
<p>status: string</p>
<p>description: string</p>
<p>year: number</p>
<p>coverImg: file (1 image)</p>
<p>genres?: [names].</p>
<p>authors?: [names].</p>
<p style="color: #e2e2de">___________________________________________</p>
<i>Если автора/жанра нет в БД, он будет создан</i>
</td>
</tr>
<tr>
<td>Request headers</td>
<td>Authorization | admin jwt-token</td>
</tr>
<tr>
<td>&nbsp;Response</td>
<td>
<p>Journal</p>
</td>
</tr>
</tbody>
</table>

* <b style="color: orange; ">POST</b> <b>/delete</b>
    
<table>
<tbody>
<tr>
<td style="width: 200px;">Request body</td>
<td style="width: 400px;">
<p>id: string</p>
</td>
</tr>
<tr>
<td>Request headers</td>
<td>Authorization | admin  jwt-token</td>
</tr>
<tr>
<td>&nbsp;Response</td>
<td>
<p>{message: 'deleted successfully'}</p>
</td>
</tr>
</tbody>
</table>

<br>

#### /chapters

Chapter entity:
```
{
    id: number,                     
    name: string,                   // единственное не генерируется 
    size: number,                   
    serial_number: number,          
    createdAt: Date                 // "YYYY-MM-DDThr:mn:sc[.nnn]"
}
```

* <b style="color: orange; ">POST</b> <b>/create</b>

<table>
<tbody>
<tr>
<td style="width: 200px;">Request body</td>
<td style="width: 400px;">
<p>journalId: string</p>
<p>chapterName?: string (по умолч. порядковый номер)</p>
<p>pages: Files</p>
<p style="color: #e2e2de">___________________________________________</p>
<i>Здесь отсутствует рализация загрузки глав поочередно, поэтому важно, чтобы страницы уже были отсортированы для сохранения порядка (например, названы 1.jpg, 2.jpg,... или a.jpg, b.jpg,...)</i>
</td>
</tr>
<tr>
<td>Request headers</td>
<td>Authorization | admin  jwt-token</td>
</tr>
<tr>
<td>&nbsp;Response</td>
<td>
<p>Chapter</p>
</td>
</tr>
</tbody>
</table>

* <b style="color: orange; ">POST</b> <b>/delete</b>

<table>
<tbody>
<tr>
<td style="width: 200px;">Request body</td>
<td style="width: 400px;">
<p>chapterId: string</p>
</td>
</tr>
<tr>
<td>Request headers</td>
<td>Authorization | admin  jwt-token</td>
</tr>
<tr>
<td>&nbsp;Response</td>
<td>
<p>{message: 'deleted successfully'}</p>
</td>
</tr>
</tbody>
</table>