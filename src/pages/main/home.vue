<template>
    <div class="main">
        <a-calendar @panelChange="onPanelChange" />
    </div>
</template>
<script>
export default {
    methods: {
        onPanelChange(value, mode) {
            console.log(value, mode);
        },
    },
};
</script>
<style scoped>
.main {
    background: #fff;
}
</style>
