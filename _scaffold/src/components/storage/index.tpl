<div>

    <OnlineStatus scope={{status: "First"}} />

    <a onClick={>navigate("/")}>На головну</a>

    <OnlineStatus scope="self" />

    <p>
        {>i18n("Local storage usage:")} {::storageSize()}K

        <button onClick={::refresh}>Refresh</button>
    </p>
    <pre data-label="pre">{::storageDump()}</pre>

    <OnlineStatus scope="self" />

</div>