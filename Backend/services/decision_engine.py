def evaluate_task(task):

    priority = task.get("priority", "").lower()
    status = task.get("status", "").lower()
    progress = task.get("progress", 0)

    if priority == "high" and status == "pending":
        return {
            "risk_level": "HIGH",
            "decision": "Immediate attention required",
            "recommendation": "Assign the task to an available team member.",
            "reason": "The task has high priority but has not started."
        }

    if priority == "high" and progress < 50:
        return {
            "risk_level": "HIGH",
            "decision": "Task is at risk",
            "recommendation": "Review task progress and consider reassignment.",
            "reason": "High-priority task has less than 50% progress."
        }

    if status == "in progress" and progress < 30:
        return {
            "risk_level": "MEDIUM",
            "decision": "Monitor task closely",
            "recommendation": "Schedule a progress review.",
            "reason": "The task is in progress but progress is below 30%."
        }

    if status == "completed" or progress == 100:
        return {
            "risk_level": "LOW",
            "decision": "No action required",
            "recommendation": "Mark the workflow step as completed.",
            "reason": "The task has been completed."
        }

    return {
        "risk_level": "LOW",
        "decision": "Continue monitoring",
        "recommendation": "No immediate intervention required.",
        "reason": "Task is progressing normally."
    }