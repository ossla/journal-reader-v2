Серверная часть приложения для чтения журналов на TypeScript

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

# API

<b>http://\<host\>/api/</b>

Порт находится в .env файле (5001)
<br>

#### /users

* <b style="color: orange; ">POST</b> <b>/registration</b>

    <table>
    <tbody>
    <tr>
    <td style="width: 200px;">Request body</td>
    <td style="width: 200px;">
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
    <td style="width: 200px;">
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
    <td style="width: 200px;">id: string</td>
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
    <td style="width: 200px;">
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

    genres: [Genre entity, ...],

    authors: [Author entity, ...],

    number_of_chapters: number(0),

    createdAt: string (date, "YYYY-MM-DDThr:mn:sc[.nnn]"),

    updatedAt: string (date, "YYYY-MM-DDThr:mn:sc[.nnn]")
}
```

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
<p>genres?: JSON arr of names (as example: ["comedy", "horror"]. if genre not exist, creates)</p>
<p>authors?: JSON arr of names (if author not exit, creates)</p>
</td>
</tr>
<tr>
<td>Request headers</td>
<td>Authorization | jwt-token</td>
</tr>
<tr>
<td>&nbsp;Response</td>
<td>
<p>Journal entity</p>
</td>
</tr>
</tbody>
</table>
<br>

* <b style="color: green; ">GET</b> <b>/</b>

<table><tbody>
<tr>
<td style="width: 200px;">Response</td>
<td style="width: 200px;">JSON: [Journal entities]</td>
</tr>
</tbody></table>  

* <b style="color: green; ">GET</b> <b>/filter</b>

<table><tbody>
<tr>
<td style="width: 200px;">Response</td>
<td style="width: 200px;">JSON: [Journal entities]</td>
</tr>
</tbody></table>


