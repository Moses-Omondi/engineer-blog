/**
 * Moses AI API Client
 * Handles communication with the Moses AI Assistant API
 */

class MosesAIClient {
    constructor() {
        this.baseURL = 'https://caaz2t8bwh.execute-api.us-east-1.amazonaws.com/prod';
        this.timeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Make API request with retry logic
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: this.timeout,
            ...options
        };

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...defaultOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                return data;

            } catch (error) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw new Error(`API request failed after ${this.retryAttempts} attempts: ${error.message}`);
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    /**
     * Get basic info about Moses AI
     */
    async getInfo() {
        try {
            return await this.makeRequest('/info');
        } catch (error) {
            return {
                error: true,
                message: "Unable to connect to Moses AI. Using cached information.",
                data: {
                    name: "Moses AI Assistant",
                    version: "1.0.0",
                    description: "Professional AI assistant backed by Moses Omondi's expertise in DevSecOps, Software Engineering, and AI",
                    status: "offline"
                }
            };
        }
    }

    /**
     * Check API health status
     */
    async getHealth() {
        try {
            return await this.makeRequest('/health');
        } catch (error) {
            return {
                error: true,
                status: "unhealthy",
                message: "API health check failed",
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get Moses' expertise summary
     */
    async getExpertise() {
        try {
            return await this.makeRequest('/expertise');
        } catch (error) {
            return {
                error: true,
                message: "Unable to fetch expertise. Using cached information.",
                data: {
                    domains: [
                        "DevSecOps & Security Engineering",
                        "Software Development (Java, Python, Bash)",
                        "Cloud Architecture (AWS Certified)",
                        "Container Orchestration (Docker, Kubernetes)",
                        "CI/CD Pipeline Security (SAST, DAST, SCA)",
                        "Artificial Intelligence & Machine Learning"
                    ],
                    certifications: [
                        "AWS Certified Solutions Architect - Associate"
                    ],
                    experience: "Professional expertise in building secure, scalable systems"
                }
            };
        }
    }

    /**
     * Send a query to Moses AI
     */
    async query(question, context = {}) {
        if (!question || question.trim().length === 0) {
            throw new Error('Question cannot be empty');
        }

        const requestBody = {
            question: question.trim(),
            context: {
                timestamp: new Date().toISOString(),
                session_id: this.generateSessionId(),
                ...context
            }
        };

        try {
            const startTime = Date.now();
            const response = await this.makeRequest('/query', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });

            const processingTime = Date.now() - startTime;
            
            return {
                ...response,
                processing_time: processingTime,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            // Fallback response when API is unavailable
            return {
                error: true,
                message: "I'm currently offline, but I'd be happy to help when the connection is restored.",
                fallback_response: this.generateFallbackResponse(question),
                processing_time: 0,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Generate a session ID for tracking conversations
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate fallback responses for common questions
     */
    generateFallbackResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('devsecops') || lowerQuestion.includes('security')) {
            return "I'd love to discuss DevSecOps and security engineering with you! I specialize in integrating security practices throughout the development lifecycle, including SAST, DAST, and SCA in CI/CD pipelines.";
        }
        
        if (lowerQuestion.includes('aws') || lowerQuestion.includes('cloud')) {
            return "As an AWS Certified Solutions Architect, I can help with cloud architecture, EC2, S3, Lambda, and security best practices. Feel free to ask about any AWS services!";
        }
        
        if (lowerQuestion.includes('docker') || lowerQuestion.includes('kubernetes')) {
            return "I have extensive experience with containerization and orchestration! I can help with Docker best practices, Kubernetes deployments, and container security.";
        }
        
        if (lowerQuestion.includes('ai') || lowerQuestion.includes('artificial intelligence')) {
            return "I'm passionate about AI and machine learning! I work with PyTorch and various AI frameworks. What specific AI topic interests you?";
        }
        
        if (lowerQuestion.includes('java') || lowerQuestion.includes('python') || lowerQuestion.includes('programming')) {
            return "I'd be happy to help with programming questions! I work extensively with Java, Python, and Bash scripting. What coding challenge are you working on?";
        }
        
        return "Thanks for your question! I'm currently offline but will be back online soon. Feel free to try again later, or check out my blog posts for insights on DevSecOps, AI, and software engineering.";
    }

    /**
     * Validate API connection
     */
    async validateConnection() {
        try {
            const health = await this.getHealth();
            return !health.error;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get connection status with details
     */
    async getConnectionStatus() {
        try {
            const health = await this.getHealth();
            return {
                online: !health.error,
                status: health.error ? 'offline' : 'online',
                message: health.error ? health.message : 'Connected successfully',
                lastChecked: new Date().toISOString()
            };
        } catch (error) {
            return {
                online: false,
                status: 'offline',
                message: 'Unable to reach Moses AI service',
                lastChecked: new Date().toISOString()
            };
        }
    }
}

// Create global instance
window.mosesAI = new MosesAIClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MosesAIClient;
}
