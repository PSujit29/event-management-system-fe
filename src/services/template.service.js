import apiClient from "../lib/apiClient";
import deriveEventStatus from "../utils/status.utils";

const IS_DEVELOPMENT = import.meta.env.MODE === "development";
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const USE_MOCK_TEMPLATES = import.meta.env.VITE_USE_MOCK_TEMPLATES === "true";

const mockTemplates = [
    {
        templateId: "tpl-tech-talk",
        name: "Tech Talk Session",
        description: "A 2-hour technical session with Q&A and networking.",
        totalDuration: 2,
        subEvents: [
            { name: "Opening", description: "Welcome and session overview" },
            { name: "Main Talk", description: "Speaker presentation and demo" },
            { name: "Q&A", description: "Audience questions and discussion" },
        ],
    },
    {
        templateId: "tpl-workshop",
        name: "Hands-on Workshop",
        description: "Structured workshop format with practical activities.",
        totalDuration: 4,
        subEvents: [
            { name: "Introduction", description: "Objectives and prerequisites" },
            { name: "Lab Session", description: "Guided hands-on implementation" },
            { name: "Review", description: "Wrap-up and feedback" },
        ],
    },
];

const canUseFallbackMocks = () => (IS_DEVELOPMENT && !API_BASE_URL) || USE_MOCK_TEMPLATES;

const shouldFallbackForError = (error) => {
    if (!canUseFallbackMocks()) return false;
    return error?.response?.status === 404 || error?.code === "ERR_NETWORK";
};

export async function getTemplates() {
    if (canUseFallbackMocks()) {
        try {
            const { data } = await apiClient.get("templates");
            return data;
        } catch (error) {
            if (shouldFallbackForError(error)) return mockTemplates;
            throw error;
        }
    }

    const { data } = await apiClient.get("templates");
    return data;
}

export async function getTemplateById(templateId) {
    if (canUseFallbackMocks()) {
        try {
            const { data } = await apiClient.get(`templates/${templateId}`);
            return data;
        } catch (error) {
            if (shouldFallbackForError(error)) {
                const matchedTemplate = mockTemplates.find((template) => template.templateId === templateId);
                if (matchedTemplate) return matchedTemplate;
            }
            throw error;
        }
    }

    const { data } = await apiClient.get(`templates/${templateId}`);
    return data;
}

export async function cloneTemplateToEvent(templateId, payload) {
    if (canUseFallbackMocks()) {
        try {
            const { data } = await apiClient.post(`templates/${templateId}/create-event`, payload);
            return data?.event ?? data;
        } catch (error) {
            if (shouldFallbackForError(error)) {
                // Mock Fallback Logic: Generate event and save to Local Storage
                const template = await getTemplateById(templateId);
                if (!template) throw new Error("Template not found");

                const { name, description, startDate } = payload;
                const baseDate = new Date(startDate);
                const newEventId = `${Date.now()}`;

                // Generate sub-events (mocking dates by adding 1 day per sub-event)
                const generatedSubEvents = template.subEvents.map((sub, index) => {
                    const subDate = new Date(baseDate);
                    subDate.setDate(subDate.getDate() + index);

                    return {
                        subEventId: `sub-${Date.now()}-${index}`,
                        eventId: newEventId,
                        name: sub.name,
                        description: sub.description,
                        startDate: subDate.toISOString().split('T')[0],
                    };
                });

                const newEvent = {
                    eventId: newEventId,
                    name,
                    description: description || template.description,
                    startDate,
                    status: deriveEventStatus(startDate),
                    subEvents: generatedSubEvents,
                    clonedFrom: templateId,
                    createdAt: new Date().toISOString(),
                };

                // Persist to local storage to simulate a backend
                const existingEvents = JSON.parse(localStorage.getItem('all_events') || '[]');
                existingEvents.push(newEvent);
                localStorage.setItem('all_events', JSON.stringify(existingEvents));

                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 800));

                return newEvent;
            }
            throw error;
        }
    }

    const { data } = await apiClient.post(`templates/${templateId}/create-event`, payload);
    return data?.event ?? data;
}