import Map "mo:core/Map";
import Storage "blob-storage/Storage";

module {
  type ProjectStatus = {
    #pending;
    #processing;
    #complete;
    #failed;
  };

  type OldMasteringProject = {
    id : Text;
    trackName : Text;
    createdAt : Int;
    preset : Text;
    status : ProjectStatus;
    owner : Principal;
  };

  type OldActor = {
    projects : Map.Map<Text, OldMasteringProject>;
  };

  type NewMasteringProject = {
    id : Text;
    trackName : Text;
    createdAt : Int;
    preset : Text;
    status : ProjectStatus;
    owner : Principal;
    trackBlob : ?Storage.ExternalBlob;
    finalMasterBlob : ?Storage.ExternalBlob;
  };

  type NewActor = {
    projects : Map.Map<Text, NewMasteringProject>;
  };

  public func run(old : OldActor) : NewActor {
    let newProjects = old.projects.map<Text, OldMasteringProject, NewMasteringProject>(
      func(_key, oldProject) {
        { oldProject with trackBlob = null; finalMasterBlob = null };
      }
    );
    { projects = newProjects };
  };
};
