import React from "react";
import { act } from "react";

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => {
  return <>
    {completedTasksCount + activeTasksCount > 0 && (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
        {
          completedTasksCount > 0 && (
            <>
              🎉Wow!You had {completedTasksCount} completed 
              {
                activeTasksCount > 0 && 
                `, rest ${activeTasksCount} task.Come on!`}
            </>
          )
        }
        {completedTasksCount===0 && activeTasksCount > 0 &&(
          <>Now doing {activeTasksCount} task! </>
        )}
        </p>
      </div>
    )}
  </>;
};

export default Footer;
