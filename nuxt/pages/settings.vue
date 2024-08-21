<script setup>

async function updateConfig(formData) {
    console.log('updateConfig');
    const {data} = await useFetch('/api/update_config', {
        method: 'POST',
        body: formData
    });
    alert('Config updated!');
}

const {data} = await useFetch('/api/get_config');
const config = computed(() => {
    return data.value.config;
})

</script>
<template>
    <PasswordProtect>
        <FormKit type="form" :value="config" @submit="updateConfig">
            <FormKit label="Donation Email Text"
            class="w-full"
            rows="50"
            placeholder="Enter the email text for the donation email"
            help="Sent to the donator after a donation"
            type="textarea" name="emailText"/>
        </FormKit>
    </PasswordProtect>
</template>