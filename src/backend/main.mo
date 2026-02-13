import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type ProjectStatus = {
    #pending;
    #processing;
    #complete;
    #failed;
  };

  public type MasteringProject = {
    id : Text;
    trackName : Text;
    createdAt : Int;
    preset : Text;
    status : ProjectStatus;
    owner : Principal;
    trackBlob : ?Storage.ExternalBlob;
    finalMasterBlob : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let projects = Map.empty<Text, MasteringProject>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Management
  public shared ({ caller }) func createProject(trackName : Text, preset : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    let id = caller.toText() # "-" # trackName # "-" # preset # "-" # Time.now().toText();
    let project : MasteringProject = {
      id;
      trackName;
      createdAt = Time.now();
      preset;
      status = #pending;
      owner = caller;
      trackBlob = null;
      finalMasterBlob = null;
    };
    projects.add(id, project);
    id;
  };

  public shared ({ caller }) func updateProjectStatus(id : Text, status : ProjectStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Only owner or admin can update
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner or admin can update this project");
        };
        let updatedProject : MasteringProject = {
          project with status;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func uploadTrack(id : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload tracks");
    };

    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Only owner or admin can upload
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner or admin can upload tracks to this project");
        };
        let updatedProject = {
          project with trackBlob = ?blob;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func uploadFinalMaster(id : Text, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload final masters");
    };

    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Only owner or admin can upload
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner or admin can upload final masters to this project");
        };
        let updatedProject = {
          project with finalMasterBlob = ?blob;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public query ({ caller }) func getProject(id : Text) : async ?MasteringProject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    switch (projects.get(id)) {
      case (null) { null };
      case (?project) {
        // Only owner or admin can view
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner or admin can view this project");
        };
        ?project;
      };
    };
  };

  public query ({ caller }) func getAllProjects() : async [MasteringProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    // Admins can see all projects, regular users only see their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      projects.values().toArray();
    } else {
      let allProjects = projects.values().toArray();
      allProjects.filter(func(p) { p.owner == caller });
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Only owner or admin can delete
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner or admin can delete this project");
        };
        projects.remove(id);
      };
    };
  };
};
