export interface Question {
  questionId: string | null
  description: string
  selectionNumber: number
  surveyId: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  optionId: string
  questionId: string
  description: string
}
export interface Survey {
  surveyId: string
  name: string
  expirationDate: Date
  questions?: Question[]
  isActive: string
}