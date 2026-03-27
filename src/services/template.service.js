import apiClient from "../lib/apiClient";

export async function getTemplates() {
    const { data } = await apiClient.get("templates");
    return data;
}

export async function getTemplateById(templateId) {
    const { data } = await apiClient.get(`templates/${templateId}`);
    return data;
}

export async function cloneTemplateToEvent(templateId, payload) {
    const { data } = await apiClient.post(`templates/${templateId}/create-event`, payload);
    return data;
}
