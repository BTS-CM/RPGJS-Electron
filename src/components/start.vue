<script setup>
    import { ref, onMounted } from 'vue';

    function trimAnsiEscapeCodes(inputString) {
        const ansiEscapeRegex = /\x1B\[[0-9;]*m/g;
        return inputString.replace(ansiEscapeRegex, '');
    }

    let _port = ref(null);
    onMounted(async () => {
        let port = await window.electron.port();
        if (!port) {
            return;
        }
        port = trimAnsiEscapeCodes(port);
        _port.value = port.split("➜")[1].trim();
    });

    /*
    onMounted(async () => {
        let directories = await window.electron.directories();
        console.log(directories);
    });
    */
</script>

<template>
    <div>
        <b>{{ _port ? "RPGJS Demo" : null}}</b><br/><br/>
        Hosting game at the following URL:<br/><br/>
        {{ _port ? _port.split("Local: ")[1] : 'Loading...' }}
    </div>
</template>
