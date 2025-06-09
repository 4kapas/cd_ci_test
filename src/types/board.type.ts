export type BoardType = {
  boardId: number;
  username: string;
  nickname: string;
  address: string;
  mobile: string;
  title: string;
  district: string;
  answerState: string;
  createdDate: string;
  answerDate: string;
  answerUser: string;
};

export type FormType = {
  size?: number;
  page: number;
  startDate: string | Date;
  endDate: string | Date;
  search?: String | null | undefined;
  district: String | null | undefined;
  nickname?: string;
};
