import { enUS, nl } from "date-fns/locale";
import { useSelector } from "react-redux";

export const getCustomLocale = () => {
  const translation = useSelector((state) => state.session.translation);
  const language = useSelector((state) => state.session.user?.language);
  if (language == "en") {
    return {
      ...enUS,
      formatDistance: (token, count, options) => {
        const result = enUS.formatDistance(token, count, options);
        return result.replace(translation.TIMELINE.about, "");
      },
    };
  } else {
    return {
      ...nl,
      formatDistance: (token, count, options) => {
        const result = nl.formatDistance(token, count, options);
        return result.replace(translation.TIMELINE.about, "");
      },
    };
  }
};

export const canAddMemory = (profileId, memoryCreation, userId, friends = [], curators = []) => {
  if (profileId === userId) {
    return true;
  } else if (memoryCreation === "everyone") {
    return true;
  } else if (memoryCreation === "friends") {
    if (friends.some((obj) => obj.id === userId)) {
      return true;
    } else if (curators.some((obj) => obj.id === userId)) {
      return true;
    } else {
      return false;
    }
  } else if (memoryCreation === "curators") {
    if (curators.some((obj) => obj.id === userId)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const extractLabel = (optionsArray, selectedItem) => {
  return optionsArray
    .filter((options) => options.value == selectedItem)
    .map((option) => option.label);
};

export const replaceName = (string, variables) => {
  return string.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, p1) => {
    return variables[p1] || match;
  });
};
